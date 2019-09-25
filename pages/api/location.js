const mysql = require('mysql');

const db = require('../../config/db.js');

// const connection = mysql.createConnection(db);

const pool = mysql.createPool(db);

export default (req, res) => {
    const {
        method
    } = req

    switch (method) {
        case 'GET':
        // Get data from your database
            const query = `SELECT * FROM location order by sido_code asc, sigungu_name asc;`;

            pool.getConnection(async (err, connection) => {
                if (err) throw err; // not connected!
              
                // Use the connection
                connection.query(query, (error, results, fields) => {

                    res.send(results);
              
                    // Handle error after the release.
                    if (error) throw error;
              
                    // Don't use the connection here, it has been returned to the pool.
                });

                // When done with the connection, release it.
                connection.release();
              });
            
            // connection.query(query, (err, rows) => {
            //     if (err) throw err;
          
            //     res.send(rows);
            // });

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