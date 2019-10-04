const mysql = require('mysql');
const request = require('request');

const db = require('../../../../config/db.js');
const imp = require('../../../../config/iamport.js');

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
                const selectMyapplicationInfo = `
                    select * from match_has_user
                    left join \`match\` on \`match\`.idmatch = match_has_user.match_idmatch
                    where match_idmatch = ${data.idmatch}
                    and user_iduser = (select iduser from user where fb_uid = '${data.uid}')
                    and order_number = '${data.order_number}';
                `;

                connection.beginTransaction((err) => {
                    if (err) { throw err; }
                    connection.query(selectMyapplicationInfo, (err, rows) => {
                        if (err) {
                            connection.rollback(() => { throw err; });
                        }
                        console.log('rows', rows);
                        const { start_time, end_time, apply_time, cancel_time, imp_uid, merchant_uid } = rows[0];
                        // token 생성
                        request.post({
                            json: true,
                            url: `${imp.API_URL}/users/getToken`,
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: {
                                imp_key: imp.imp_key,
                                imp_secret: imp.imp_secret,
                            }
                        }, (err, rsp, body) => {
                            const response = body.response;
                            console.log(`body1`, body);
                            if (err) {
                                res.status(500).json({
                                    msg: '취소 실패',
                                    err,
                                })
                                connection.rollback(() => { throw err; });
                            } else if (response === null) {
                                res.status(200).json({
                                    msg: body.message,
                                })
                            } else {
                                const access_token = body.response.access_token;
                                // token, imp_uid 기반하여 해당 결제 취소 요청

                                const selectQuery = {
                                    normal: {
                                        twentyFourAgo:
                                            `
                                                select display_name from user where iduser = 5;
                                            `,
                                        twelveToTwentyFour:
                                            `

                                            `,
                                        sixToTwelve:
                                            `

                                            `,
                                        twoToSix:
                                            `

                                            `,
                                        zeroToTwo:
                                            `
                                                select display_name from user where iduser = 5;
                                            `,
                                    }
                                };

                                console.log(`data.refundOption`, data.refundOption);
                                const checkZero = data.refundOption.option;
                                console.log(`checkZero`, checkZero);

                                /*
                                
                                
                                
                                
                                
                                
                                    이제 DB에다가 취소 내역 UPDATE !
                                
                                
                                
                                
                                
                                
                                
                                */

                                if (checkZero === 'twentyFourAgo') {
                                    connection.query(selectQuery[data.refundOption.option_type][data.refundOption.option], (err, rows) => {
                                        if (err) {
                                            connection.rollback(() => { throw err; });
                                        }
                                        
                                        connection.commit((err) => {
                                            if (err) { 
                                                res.status(500).json({
                                                    msg: '취소 실패',
                                                    err,
                                                })
                                                connection.rollback(() => { throw err; });
                                            } else {
                                                console.log('Cancel Apply the match Transaction Completed.ㅋㅋ');
                                                res.status(200).json({
                                                    rows,
                                                    msg: '취소 완료',
                                                })
                                            }
                                        });
                                    })
                                } else {
                                    request.post({
                                        json: true,
                                        url: `${imp.API_URL}/payments/cancel`,
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': access_token,
                                        },
                                        body: {
                                            imp_uid: imp_uid,
                                            merchant_uid: merchant_uid,
                                            amount: data.refundOption.amount || null,
                                        },
                                    }, (err, rsp, body) => {
                                        const response = body.response;
                                        console.log(`body2`, body);
                                        if (err) {
                                            res.status(500).json({
                                                msg: '취소 실패',
                                                err,
                                            })
                                            connection.rollback(() => { throw err; });
                                        } else if (response === null) {
                                            res.status(200).json({
                                                msg: body.message,
                                            })
                                        } else {
                                            connection.commit((err) => {
                                                if (err) { 
                                                    res.status(500).json({
                                                        msg: '취소 실패',
                                                        err,
                                                    })
                                                    connection.rollback(() => { throw err; });
                                                } else {
                                                    console.log('Cancel Apply the match Transaction Completed.', body);
                                                    res.status(200).json({
                                                        msg: '취소 완료',
                                                    })
                                                }
                                            });
                                        }
                                    })
                                }
                            }
                        })
                    });
                });
            } catch (error) {
                res.status(500).json({ error: error });
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