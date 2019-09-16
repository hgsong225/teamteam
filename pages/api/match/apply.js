const mysql = require('mysql');
const request = require('request');
const moment = require('moment');

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
                }, (err, rsp, body) => {
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
                        }, (err, rsp, body) => {
                            if (err) {
                                res.status(500).json({ err: err.toString() });
                            } else {
                                // status === 'paid', paid_amount === 'price' 검사
                                const response = body.response;
                                if (response.status === 'paid' && response.amount === data.total_price) {
                                    // 결제 상태 paid(정상, 완료인 상태), 결제 총액과 상품가격 일치가 true, db에 정보 저장
                                    const total_match_payment_amount = data.total_match_payment_amount + response.amount; // 기존 총 경기 결제 금액 + 현재 경기 결제 금액
                                    const commission_rate = 0.2; // 참가비 수수료율
                                    const commission = response.amount * commission_rate; // 참가비 수수료 // 20 = 100 * 0.2
                                    const total_commission = data.total_commission + commission; // 기존 총 참가비 수수료 + 참가비 수수료
                                    const host_revenue = response.amount - commission; // 호스트 환급 금액 // 80 = 100 - 20
                                    const total_host_revenue = data.host_revenue + host_revenue; // 총 호스트 환급 금액 // 160 = 80 + 80
                                    
                                    console.log(`response.amount`, response.amount);
                                    console.log(`total_match_payment_amount`, total_match_payment_amount);
                                    console.log(`commission`, commission);
                                    console.log(`data.host_revenue`, data.host_revenue);
                                    console.log(`host_revenue`, host_revenue);
                                    console.log(`total_host_revenue`, total_host_revenue);
                                    
                                    const payment_time = moment(response.paid_at).format("YYYY-MM-DD HH:mm:ss");
                                    console.log(`response.paid_at:`, response.paid_at);
                                    console.log(`payment_time`, payment_time);
                                    console.log(`data.order_number`, data.order_number);

                                    const insertMatchUser = `
                                    INSERT INTO match_has_user 
                                            (match_idmatch,
                                            user_iduser, 
                                            apply_time,
                                            payment_time,
                                            match_has_user_fee, 
                                            applicant_status,
                                            amount_of_payment,
                                            payment_status, 
                                            payment_method,
                                            total_player,
                                            commission_rate, 
                                            commission,
                                            order_number)
                                    VALUES  (${data.idmatch},
                                            ${data.iduser}, 
                                            NOW(),
                                            '${payment_time}',
                                            '${data.match_has_user_fee}',
                                            '${data.applicant_status}',
                                            '${response.amount}',
                                            '결제완료',
                                            '${data.pay_method}',
                                            '${data.total_player}',
                                            '${commission_rate}',
                                            '${commission}',
                                            '${data.order_number}');
                                    `;

                                    //error 발생시 결제 취소까지

                                    connection.beginTransaction((err) => {
                                        if (err) { throw err; }
                                        connection.query(insertMatchUser, (err, rows) => {
                                            if (err) { connection.rollback(() => { throw err; }); }
                                            const updateHostRevenue = `
                                            update \`match\`
                                            set
                                                total_match_payment_amount = ${total_match_payment_amount},
                                                total_commission = ${total_commission},
                                                host_revenue = ${total_host_revenue}
                                            where idmatch = ${data.idmatch};
                                            `;
                                            
                                            connection.query(updateHostRevenue, (err, rows) => {
                                            if (err) { connection.rollback(() => { throw err; }); }
                                                
                                                connection.commit((err) => {
                                                    if (err) { 
                                                        console.log(err);
                                                        connection.rollback(() => { throw err; });
                                                    }
                                                    console.log('Apply Match Transaction Complete.');
                                                    res.status(200).json({
                                                        msg: '결제 완료',
                                                        status: response.status,
                                                    })
                                                });
                                            })
                                        });
                                    })
                                } else {
                                    // if not, return. failed 같은 경우는 db에 안 넣음.
                                    res.status(500).json({
                                        msg: '에러 발생',
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