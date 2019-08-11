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

        res.status(200).json({ message: 'GET 요청' })

        break

        case 'POST':
        // Create data in your database
            try {
                const data = req.body.data;
                const matchQuery = `
                    update \`match\`
                    set match_status = '경기취소', apply_status = '신청불가', match_cancel_time = NOW(), match_reason_for_cancel = '개인사정', host_revenue = 0, host_revenue_status = 0
                    where idmatch = ${data.idmatch};
                `
                let match_has_userQuery = `
                    update match_has_user
                    set applicant_status = '신청취소', cancel_type = case when cancel_type is NULL then '경기취소' end, cancel_time = case when cancel_type = '경기취소' then NOW() end, reason_for_cancel = case when cancel_type = '경기취소' then '호스트(경기취소)' end,
                `;
                let refund_statusQuery = `case `;
                let refund_fee_rateQuery = `case `;
                let refund_feeQuery = `case `;
                let match_has_userLastQuery = `where match_idmatch = ${data.idmatch} and applicant_status != '신청취소';`;
                
                for (let i = 0; i < data.applicants.length; i += 1) {
                    if (i !== data.applicants.length - 1) {
                        refund_feeQuery += `when user_iduser = ${data.applicants[i].iduser} then ${data.applicants[i].amount_of_payment * 1} `;
                    } else {
                        refund_statusQuery = `case when payment_status = '결제전' then '환불완료' else '환불전' end`
                        refund_fee_rateQuery = `case when payment_status = '결제전' then 0 else 1 end`
                        refund_feeQuery += `when user_iduser = ${data.applicants[i].iduser} then ${data.applicants[i].amount_of_payment * 1} end`;
                    }
                }
                match_has_userQuery += `refund_status = ${refund_statusQuery}, refund_fee_rate = ${refund_fee_rateQuery}, refund_fee = ${refund_feeQuery} ${match_has_userLastQuery}`;
        
                console.log(`match_has_userQuery`, match_has_userQuery);
                
                /* Begin transaction */
                connection.beginTransaction((err) => {
                    if (err) { throw err; }
                    connection.query(matchQuery, (err, result) => {
                        if (err) {
                            console.log(err);
                            connection.rollback(() => { throw err; });
                        }
                        connection.query(match_has_userQuery, (err, result) => {
                            if (err) {
                                console.log(err);
                                connection.rollback(() => { throw err; });
                            }
                            connection.commit((err) => {
                                if (err) { 
                                    console.log(err);
                                    connection.rollback(() => { throw err; });
                                }
                                console.log('Transaction Complete.');
                                res.send(result);
                            });
                        })
                    })
                })
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