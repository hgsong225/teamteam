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
            try {
                const data = req.query;
                const query = `select location_idlocation from post_has_location where post_idpost = ${data.id}`;
        
                /* Begin transaction */
                connection.beginTransaction((err) => {
                    if (err) { throw err; }
                    connection.query(query, (err, result) => {
                        if (err) { 
                            connection.rollback(() => { throw err; });
                        }
                        let query2 = `select idlocation, sido_name, sigungu_name from location where idlocation in (`;
                        for (let i = 0; i < result.length; i += 1) {
                          if (i == result.length - 1) {
                            query2 += `${result[i].location_idlocation});`;
                          } else {
                            query2 += `${result[i].location_idlocation},`;
                          }
                        }
                        connection.query(query2, (err, result) => {
                          if (err) { 
                            connection.rollback(() => { throw err; });
                          }
                          connection.commit((err) => {
                            if (err) { 
                                connection.rollback(() => { throw err; });
                            }
                            console.log('Transaction Complete.');
                          });
                          res.send(result);
                        });
                    })
                });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }

        break

        case 'POST':
        // Create data in your database

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