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
                console.log('DATA', data);
                const commission_rate = 0.2;
                const commission = data.match_has_user_fee * commission_rate;
                const query = `
                INSERT INTO match_has_user 
                        (match_idmatch,
                        user_iduser, 
                        apply_time, 
                        depositor, 
                        match_has_user_fee, 
                        applicant_status, 
                        payment_status, 
                        payment_method, 
                        commission_rate, 
                        commission)
                VALUES  (${data.idmatch},
                        (SELECT iduser FROM user WHERE fb_uid = '${data.uid}'), 
                        NOW(), 
                        '${data.depositor}',
                        '${data.match_has_user_fee}',
                        '승인대기중',
                        '결제전',
                        '계좌이체',
                        '${commission_rate}',
                        '${commission}');
                `;

                connection.query(query, (err, rows) => {
                    if (err) throw err;
                    res.send(rows);
                });
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