const mysql = require('mysql');

const db = require('../../config/db.js');

const connection = mysql.createConnection(db);

export default (req, res) => {
    const {
    method
    } = req

    switch (method) {
        case 'GET':
        // Get data from your database

        res.status(200).json({ message: 'GET 요청' })

        break

        case 'POST':
        // Create data in your database
            try {
                const data = req.body.data;
                const postQuery = `
                    update post
                    set contents = '${data.contents}', edit_time = NOW()
                    where idpost = ${data.idpost};
                `;
                console.log(data, data.selected_location);
                const matchQuery = `
                    UPDATE \`match\` 
                    SET    host_account = '${data.deposit_account}', 
                           match_fee = ${data.fee}, 
                           sports_category = '${data.selected_sports_category}', 
                           match_type = ${data.selected_sports_type}, 
                           total_game_capacity = ${data.selected_sports_type * 2}, 
                           total_guest = ${data.total_guest}, 
                           start_time = '${data.match_date} ${data.match_start_time}', 
                           end_time = '${data.match_date} ${data.match_end_time}',
                           place_name = '${data.selected_place.place_name}',
                           address = '${data.selected_place.address_name}'
                    WHERE  post_idpost = ${data.idpost}
                    AND    idmatch = ${data.idmatch};
                `;
        
                const delete_post_has_locationQuery = `
                    DELETE 
                    FROM   post_has_location 
                    WHERE  post_idpost = ${data.idpost};
                `;
        
                let post_has_locationQuery = `
                    INSERT INTO post_has_location 
                    (post_idpost, 
                     location_idlocation) 
                    VALUES 
                `;
        
                /* Begin transaction */
                connection.beginTransaction((err) => {
                    if (err) { throw err; }
                    connection.query(postQuery, (err, result) => {
                        if (err) {
                            console.log(err);
                            connection.rollback(() => { throw err; });
                        }
        
                        connection.query(matchQuery, (err, result) => {
                            if (err) {
                                console.log(err);
                                connection.rollback(() => { throw err; });
                            }
        
                            connection.query(delete_post_has_locationQuery, (err, result) => {
                                if (err) {
                                    console.log(err);
                                    connection.rollback(() => { throw err; });
                                }
        
                                for (let i = 0; i < data.selected_location.length; i += 1) {
                                    if (i == data.selected_location.length - 1) {
                                        post_has_locationQuery += `(${data.idpost}, ${data.selected_location[i].idlocation});`;
                                    } else {
                                        post_has_locationQuery += `(${data.idpost}, ${data.selected_location[i].idlocation}), `
                                    }
                                }
        
                                connection.query(post_has_locationQuery, (err, result) => {
                                    if (err) { 
                                        console.log(err);
                                        connection.rollback(() => { throw err; });
                                    }
        
                                    connection.commit((err) => {
                                        if (err) { 
                                            console.log(err);
                                            connection.rollback(() => { throw err; });
                                        }
                                        console.log('Transaction Complete.');
                                        res.send(result);
                                    });
                                });
                            });
                        });
                    });
                });
                /* End transaction */
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
        res.status(200).json({ message: 'POST 요청' });

        break

        case 'PUT':
        // Update data in your database

        res.status(200).json({ message: 'PUT 요청' });

        break

        case 'DELETE':
        // Delete data from your database

        res.status(200).json({ message: 'DELETE 요청' });

        break

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
            res.status(405).end(`Method ${method} Not Allowed`)
        }
}