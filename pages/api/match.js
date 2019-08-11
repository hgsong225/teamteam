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
            try {
                const data = req.query;
                const query = `
                SELECT * FROM post
                LEFT JOIN \`match\`
                    ON post.idpost = \`match\`.post_idpost
                LEFT JOIN user ON user.iduser = post.user_iduser
                    WHERE post_idpost = ${data.id};
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

        res.status(200).json({ message: 'DELETE 요청' });

        break

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
            res.status(405).end(`Method ${method} Not Allowed`)
        }
}