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
            connection.query('SELECT * FROM post', (err, rows) => {
                if (err) throw err;
        
                res.send(rows);
            });

        break

        case 'POST':
        // Create data in your database

        res.status(200).json({ });

        break

        case 'PUT':
        // Update data in your database

        res.status(200).json({ });

        break

        case 'DELETE':
        // Delete data from your database

        res.status(200).json({ });
        
        break

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
            res.status(405).end(`Method ${method} Not Allowed`)
        }
}