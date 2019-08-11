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
                const query = `
                SELECT * FROM post
                LEFT JOIN \`match\` ON post.idpost = \`match\`.post_idpost
                LEFT JOIN match_has_user ON \`match\`.idmatch = match_has_user.match_idmatch
                LEFT JOIN user ON user.iduser = match_has_user.user_iduser
                    WHERE post_idpost = ${data.id}
                    and match_has_user.user_iduser is not null;
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
            try {
                const data = req.body.data;
                let query = '';
                
                if (data.cancel !== null) {
                    query = `
                    UPDATE match_has_user 
                    SET 
                        applicant_status = '${data.applicant_status}',
                        cancel_time = NOW(),
                        cancel_type = '${data.cancel.cancel_type}',
                        reason_for_cancel = '${data.cancel.reason_for_cancel}',
                        refund_status = '${data.cancel.refund_status}',
                        refund_fee_rate = ${data.cancel.refund_fee_rate},
                        refund_fee = ${data.cancel.refund_fee}
                    WHERE
                        match_idmatch = ${data.idmatch} AND user_iduser = ${data.iduser} AND payment_status = '결제완료';
                    `;
                } else {
                    query = `
                    UPDATE match_has_user 
                    SET 
                        applicant_status = '${data.applicant_status}'
                    WHERE
                        match_idmatch = ${data.idmatch} AND user_iduser = ${data.iduser} AND payment_status = '결제완료';
                    `;
                }

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