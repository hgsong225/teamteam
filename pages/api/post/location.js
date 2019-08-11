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
                console.log(data);
                const sido_name = data.sido_name;
                const sigungu_name = data.sigungu_name;
                const query = sigungu_name
                    ? `
                    SELECT *, p.user_iduser as hostID FROM post p
                    LEFT JOIN \`match\` ON p.idpost = \`match\`.post_idpost
                    LEFT JOIN match_has_user ON \`match\`.idmatch = match_has_user.match_idmatch
                    LEFT JOIN user ON user.iduser = match_has_user.user_iduser
                    LEFT JOIN post_has_location
                    ON p.idpost = post_has_location.post_idpost
                    WHERE location_idlocation =
                        (
                        SELECT idlocation
                        FROM location
                        WHERE sido_name = '${sido_name}'
                        AND sigungu_name = '${sigungu_name}'
                        )
                    AND apply_status ='신청가능'
                    ORDER BY create_time DESC;
                    `
                    : `
                    SELECT *, p.user_iduser as hostID FROM post p
                    LEFT JOIN \`match\` ON p.idpost = \`match\`.post_idpost
                    LEFT JOIN post_has_location
                    ON idpost = post_idpost
                    LEFT JOIN
                    location
                    ON location_idlocation = idlocation WHERE sido_name = '${sido_name}'
                    LIMIT 100
                    ORDER BY create_time DESC;
                    `;
        
        
                connection.query(query, (err, rows) => {
                    if (err) throw err;
                    const result = rows.reduce((total, {
                      iduser,
                      fb_uid,
                      phone,
                      bod,
                      height,
                      weight,
                      name,
                      display_name,
                      introduction,
                      gender,
                      email,
                      match_idmatch,
                      apply_time,
                      depositor,
                      bank_account,
                      match_has_user_fee,
                      applicant_status,
                      amount_of_payment,
                      payment_status,
                      payment_method,
                      payment_time,
                      cancel_type,
                      cancel_time,
                      reason_for_cancel,
                      commission_rate,
                      commission,
                      refund_status,
                      refund_fee_rate,
                      refund_fee,
                      ...data
                    }) => {
                      if (!total[data.idpost]) {
                        total[data.idpost] = data;
                        total[data.idpost].match_has_users = [];
                      }
                      total[data.idpost].match_has_users.push({
                        iduser,
                        fb_uid,
                        phone,
                        bod,
                        height,
                        weight,
                        name,
                        display_name,
                        introduction,
                        gender,
                        email,
                        match_idmatch,
                        apply_time,
                        depositor,
                        bank_account,
                        match_has_user_fee,
                        applicant_status,
                        amount_of_payment,
                        payment_status,
                        payment_method,
                        payment_time,
                        cancel_type,
                        cancel_time,
                        reason_for_cancel,
                        commission_rate,
                        commission,
                        refund_status,
                        refund_fee_rate,
                        refund_fee,
                      });
                      return total;
                    }, {});
                    res.send(Object.values(result));
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