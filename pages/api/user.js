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
                const query = `SELECT * FROM \`user\` WHERE fb_uid = '${data.uid}'`;

                connection.query(query, (err, rows) => {
                    if (err) throw err;
                    console.log(rows);
                    res.send(rows);
            });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }

        break

        case 'POST':
        // Create data in your database
            try {
                const {
                    fb_uid,
                    name,
                    email,
                    phone,
                    display_name,
                    account,
                } = req.body.data;
                console.log(req.body.data);
                const query = `INSERT INTO user (fb_uid, name, email, phone, display_name, account) VALUES ('${fb_uid}', '${name}', '${email}', '${phone}', '${display_name}', '${account}')`;
        
                connection.query(query, (err, rows) => {
                    if (err) throw err;
                    res.send(rows);
                });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }

        break

        case 'PUT':
        // Update data in your database
            try {
                const {
                    account,
                    displayName,
                    email,
                    phoneNumber,
                    bod,
                    gender,
                    height,
                    weight,
                    iduser,
                    introduction,
                    name,
                } = req.body.data;
                console.log(req.body.data);

                const query = `
                    update \`user\`
                    set
                        account = '${account}',
                        display_name = '${displayName}',
                        email = '${email}',
                        phone = '${phoneNumber}',
                        bod = '${bod}',
                        gender = '${gender}',
                        height = ${height},
                        weight = ${weight},
                        introduction = '${introduction}',
                        name = '${name}'
                    where iduser = ${iduser};
                `;
        
                connection.query(query, (err, rows) => {
                    if (err) throw err;
                    res.send(rows);
                });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }

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