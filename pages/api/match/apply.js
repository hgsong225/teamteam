const mysql = require('mysql');
const request = require('request');

const db = require('../../../config/db.js');
const imp = require('../../../config/iamport.js');

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








        // 트랜젝션 만들어서 match 테이블에 host_revenue에도 update 시키렴 ~










        case 'POST':
            // 결제 완료 후 db에 저장
            try {
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
                }, (err, response, body) => {
                    if (err) {
                        res.status(500).json({ err: err.toString() });
                    } else {
                        const data = req.body.data;

                        const access_token = body.response.access_token;
                        // token, imp_uid 기반하여 해당 결제정보 받아오기
                        request.get({
                            json: true,
                            url: `${imp.API_URL}/payments/${data.rsp.imp_uid}`,
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': access_token,
                            }
                        }, (err, response, body) => {
                            if (err) {
                                res.status(500).json({ err: err.toString() });
                            } else {
                                // status === 'paid', paid_amount === 'price' 검사
                                if (response.status === 'paid' && response.amount === data.total_price) {
                                    // yes, db에 정보 저장
                                    console.log(`bodyyyyyyyyyyyyyyyyyyyyy`, body);
                                    const response = body.response;
    
                                    const commission_rate = 0.2;
                                    const commission = data.match_has_user_fee * commission_rate;
                                    const queryFor_MatchHasUser_TB = `
                                    INSERT INTO match_has_user 
                                            (match_idmatch,
                                            user_iduser, 
                                            apply_time, 
                                            match_has_user_fee, 
                                            applicant_status,
                                            amount_of_payment,
                                            payment_status, 
                                            payment_method,
                                            total_player,
                                            commission_rate, 
                                            commission)
                                    VALUES  (${data.idmatch},
                                            (SELECT iduser FROM user WHERE fb_uid = '${data.uid}'), 
                                            NOW(),
                                            '${data.match_has_user_fee}',
                                            '${data.applicant_status}',
                                            '${response.amount}',
                                            '결제완료',
                                            '${data.pay_method}',
                                            '${data.total_player}',
                                            '${commission_rate}',
                                            '${commission}');
                                    `;
    
                                    connection.query(query, (err, rows) => {
                                        if (err) throw err;
                                        res.send(rows);
                                    });
                                } else {
                                    // if not, return. failed 같은 경우는 db에 안 넣음.
                                    res.status(500).json({
                                        msg: '서비스 가격이 다릅니다.',
                                        status: response.status,
                                        paid_amount: response.amount,
                                        total_price: data.total_price,
                                    });
                                }
                            }
                        })
                    }
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