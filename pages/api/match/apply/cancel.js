const mysql = require('mysql');

const db = require('../../../../config/db.js');

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
                console.log(`data`, data);
                let test = {
                    uid: 'XqWVweCL4lVF9rDyEnJIkqvZY382',
                    match_idmatch: 2,
                }
                const query1 = `
                    select * from match_has_user
                    left join \`match\` on \`match\`.idmatch = match_has_user.match_idmatch
                    where match_idmatch = ${data.idmatch}
                    and user_iduser = (select iduser from user where fb_uid = '${data.uid}');
                `;

                connection.beginTransaction((err) => {
                    if (err) { throw err; }
                    connection.query(query1, (err, rows) => {
                        if (err) {
                            connection.rollback(() => { throw err; });
                        }
                        console.log('rows', rows);
                        const { start_time, end_time, apply_time, cancel_time } = rows[0];
                        const timeDiff = (new Date(start_time).getTime() - new Date().getTime()) / 1000;

                        let query2 = ``;
                        // 경기시작 24시간 전에 취소시 - 전액 환불
                        if (timeDiff > 86400) {
                            query2 = `
                                update match_has_user
                                set applicant_status = '신청취소',
                                    cancel_time = NOW(),
                                    cancel_type = '24_hours_ago',
                                    reason_for_cancel = '게스트(신청취소)',
                                    refund_status = case when payment_status = '결제전' then '환불완료' when payment_status = '결제완료' then '환불완료' end,
                                    refund_fee_rate = case when payment_status = '결제전' then 0 when payment_status = '결제완료' then 0 end,
                                    refund_fee = case when payment_status = '결제전' then 0 when payment_status = '결제완료' then 0 * ${rows[0].amount_of_payment} end
                                where user_iduser = (select iduser from user where fb_uid = '${data.uid}')
                            `;
                        }
                        // 경기시작 24시간 이내 취소시 - 환불 x
                        if (timeDiff <= 86400 && timeDiff > 0) {
                            query2 = `
                                update match_has_user
                                set applicant_status = '신청취소',
                                    cancel_time = NOW(),
                                    cancel_type = '당일취소',
                                    reason_for_cancel = '게스트(신청취소)',
                                    refund_status = case when payment_status = '결제전' then '환불완료' when payment_status = '결제완료' then '환불전' end,
                                    refund_fee_rate = case when payment_status = '결제전' then 0 when payment_status = '결제완료' then 1 end,
                                    refund_fee = case when payment_status = '결제전' then 0 when payment_status = '결제완료' then 1 * ${rows[0].amount_of_payment} end
                                where user_iduser = (select iduser from user where fb_uid = '${data.uid}')
                            `;
                        }
                        connection.query(query2, (err, rows) => {
                            if (err) {
                                connection.rollback(() => { throw err; });
                            }
                            connection.commit((err) => {
                                if (err) { 
                                    console.log(err);
                                    connection.rollback(() => { throw err; });
                                }
                                console.log('Transaction Complete.');
                                res.send(rows);
                            });
                        })
                    });
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