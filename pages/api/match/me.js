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
                const query = `SELECT *, p.user_iduser as hostID FROM post p
                LEFT JOIN \`match\` ON p.idpost = \`match\`.post_idpost
                WHERE user_iduser =
                    (SELECT iduser
                    FROM user
                    WHERE fb_uid = '${data.uid}')
                        AND \`p\`.post_type = '용병모집'
                ORDER BY \`match\`.start_time ASC;
                `;

                connection.query(query, (err, rows) => {
                    if (err) throw err;
                    res.send(rows);
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
            try {
                const { idpost } = req.query;
                const query = `DELETE FROM post WHERE idpost = '${idpost}'`;
        
                connection.query(query, (err, rows) => {
                    if (err) throw err;
                    res.send(rows);
                });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }

        break

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
            res.status(405).end(`Method ${method} Not Allowed`)
        }
}