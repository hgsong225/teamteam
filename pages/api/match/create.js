const mysql = require('mysql');

const db = require('../../../config/db.js');

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
                const {
                    uid,
                    selected_location,
                    selected_sports_category,
                    selected_sports_type,
                    total_needed_guest,
                    match_date,
                    match_start_time,
                    match_end_time,
                    selected_place,
                    contents,
                    fee,
                    deposit_account,
                } = req.body.data;

                console.log('holy', req.body.data);
        
                let postQuery = `
                INSERT INTO \`post\` (user_iduser, post_type, contents, create_time, source, url)
                VALUES (
                        (SELECT iduser
                        FROM user
                        WHERE fb_uid = "${uid}"),
                        "용병모집",
                        "${contents}",
                        NOW(),
                        "teamteam",
                        "http://www.teamteam.co");
                `;
        
                let post_has_locationQuery = `INSERT INTO \`post_has_location\` (post_idpost, location_idlocation) VALUES `;
                
                connection.beginTransaction((err) => {
                    if (err) throw err;
                    
                    connection.query(postQuery, (err, rows) => {
                        if (err) {
                            console.log(err);
                            connection.rollback(() => { throw err; });
                        }
                        const selectIdpost = `
                        SELECT idpost FROM post WHERE user_iduser = (SELECT iduser FROM user WHERE fb_uid = "${uid}")
                                        AND post_type = "용병모집"
                                        AND contents = "${contents}"
                                        ORDER BY create_time DESC limit 1
                        `;
                        connection.query(selectIdpost, (err, rows) => {
                            if (err) {
                                connection.rollback(() => { throw err; });
                            }
                            const idpost = rows[0].idpost;
                            console.log(`idpost`, idpost);
                            const matchQuery = `
                            INSERT INTO \`match\`(
                                post_idpost,
                                sports_category,
                                match_type,
                                match_fee,
                                total_game_capacity,
                                total_needed_guest,
                                start_time,
                                end_time,
                                match_status,
                                apply_status,
                                place_name,
                                address,
                                place_latitude,
                                place_longtitude,
                                host_account,
                                host_revenue,
                                host_revenue_status)
                            VALUES
                            (
                                ${idpost},
                                "${selected_sports_category}",
                                "${selected_sports_type}",
                                "${fee}",
                                "${selected_sports_type * 2}",
                                "${total_needed_guest}",
                                "${match_date} ${match_start_time}",
                                "${match_date} ${match_end_time}",
                                "경기 전",
                                "신청가능",
                                "${selected_place.place_name}",
                                "${selected_place.address_name}",
                                "${selected_place.x}",
                                "${selected_place.y}",
                                "${deposit_account}",
                                "0",
                                "지급전"
                            );
                            `;
                            connection.query(matchQuery, (err, rows) => {
                                if (err) {
                                    console.log(err);
                                    connection.rollback(() => { throw err; })
                                }
                                console.log(`rows`, rows);
                                for (let i = 0; i < selected_location.length; i += 1) {
                                    if (i == selected_location.length - 1) {
                                        post_has_locationQuery += `
                                        (
                                            ${idpost},
                                            (
                                                SELECT idlocation
                                                FROM location
                                                WHERE sido_name = "${selected_location[i].sido}"
                                                AND sigungu_name = "${selected_location[i].sigungu}"
                                            )
                                        )
                                        `;
                                    } else {
                                        post_has_locationQuery += `
                                        (
                                            ${idpost},
                                            (
                                                SELECT idlocation
                                                FROM location
                                                WHERE sido_name = "${selected_location[i].sido}"
                                                AND sigungu_name = "${selected_location[i].sigungu}"
                                            )
                                        ),
                                        `;
                                    }
                                }
        
                                connection.query(post_has_locationQuery, (err, rows) => {
                                    if (err) {
                                        connection.rollback(() => { throw err; });
                                    }
                                    
                                    connection.commit((err) => {
                                        if (err) {
                                            connection.rollback(() => {throw err; });
                                        }
                                        console.log('Transactio Completed');
                                    })
                                    res.send({ idpost, });
                                });
                            })
                        });
                    });
                })
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }

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