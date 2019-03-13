const express = require('express');
const next = require('next');
const mysql = require('mysql');
var cors = require('cors');
const request = require('request');

const dbConfig = require('./config/db.js');
const nCloud = require('./config/ncloud.js');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
    .then(() => {
        const server = express();

        server.use(express.static('static'));
        const connection = mysql.createConnection(dbConfig);

        server.use(cors());
        server.use(express.json());

        server.post('/test', (req, res) => {
            res.send(req.body);
        });

        server.get('/api/location', (req, res) => { //location 업데이트
            connection.query('SELECT * from location', (err, rows) => {
                if (err) throw err;
        
                res.send(rows);
            });
        });
        
        server.get('/api/post', (req, res) => {
            connection.query('SELECT * FROM post', (err, rows) => {
                if (err) throw err;
        
                res.send(rows);
            });
        });
        
        server.get('/api/match', (req, res) => {
            try {
                const data = req.query;
                console.log(data);
                const query = `
                SELECT * FROM post
                LEFT JOIN \`match\`
                    ON post.idpost = \`match\`.post_idpost
                LEFT JOIN user ON user.iduser = post.user_iduser
                    WHERE post_idpost = ${data.id};
                `;
        
                connection.query(query, (err, rows) => {
                    if (err) throw err;
                    console.log(rows);
                    res.send(rows);
                });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
        });
        
        server.post('/api/match/apply', (req, res) => {
            try {
                const data = req.body.data;
                console.log('/api/match/apply', data);
                // (user_iduser, 
                //     apply_time, 
                //     depositor, 
                //     bank_account, 
                //     phone, 
                //     match_has_user_fee, 
                //     applicant_status, 
                //     payment_status, 
                //     amount_of_payment, 
                //     payment_method, 
                //     payment_time, 
                //     cancel_type, 
                //     cancel_time, 
                //     reason_for_cancel, 
                //     commission_rate, 
                //     commission, 
                //     refund_status, 
                //     refund_fee_rate, 
                //     refund_fee)
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
                    console.log(rows);
                    res.send(rows);
                });
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: error.toString() });
            }
        });
        
        server.get('/api/match/applicants', (req, res) => {
            try {
                const data = req.query;
                console.log(data);
                const query = `
                SELECT * FROM post
                LEFT JOIN \`match\` ON post.idpost = \`match\`.post_idpost
                LEFT JOIN match_has_user ON \`match\`.idmatch = match_has_user.match_idmatch
                LEFT JOIN user ON user.iduser = match_has_user.user_iduser WHERE post_idpost = ${data.id} AND match_has_user.user_iduser !=
                (SELECT iduser
                FROM user
                WHERE fb_uid = '${data.uid}');
                `;
        
                connection.query(query, (err, rows) => {
                    if (err) throw err;
                    console.log(rows);
                    res.send(rows);
                });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
        });
        
        server.get('/api/match/me', (req, res) => { // 내경기 불러오기
            try {
                const data = req.query;
                const query = `SELECT * FROM post
                LEFT JOIN \`match\` ON post.idpost = \`match\`.post_idpost
                WHERE user_iduser =
                    (SELECT iduser
                    FROM user
                    WHERE fb_uid = '${data.uid}')
                        AND \`post\`.post_type = '용병 모집'
                ORDER BY \`match\`.start_time ASC;
                `;
        
                connection.query(query, (err, rows) => {
                    if (err) throw err;
                    res.send(rows);
                });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
        });
        
        server.get('/api/match/me/apply', (req, res) => { // 내경기 불러오기
            try {
                const data = req.query;
                const query = `SELECT * FROM post
                LEFT JOIN \`match\` ON post.idpost = \`match\`.post_idpost
                LEFT JOIN match_has_user ON \`match\`.idmatch = match_has_user.match_idmatch
                LEFT JOIN user ON user.iduser = match_has_user.user_iduser
                    WHERE match_has_user.user_iduser =
                        (SELECT iduser FROM user
                            WHERE fb_uid = '${data.uid}'
                        )
                ORDER BY \`match\`.start_time ASC;
                `;
        
                connection.query(query, (err, rows) => {
                    if (err) throw err;
                    res.send(rows);
                });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
        });
        
        server.delete('/api/match/me/remove', (req, res) => { // 내경기 불러오기
            try {
                const { idpost } = req.query;
                console.log('remove', req.query);
                const query = `DELETE FROM post WHERE idpost = '${idpost}'`;
        
                connection.query(query, (err, rows) => {
                    if (err) throw err;
                    res.send(rows);
                });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
        });
        
        server.post('/api/match/applicant/status', (req, res) => { // 내경기 불러오기
            try {
                const data = req.body.data;
                console.log(data);
                const query = `
                UPDATE match_has_user 
                SET 
                    applicant_status = '${data.applicant_status}'
                WHERE
                    match_idmatch = ${data.idmatch} AND user_iduser = ${data.iduser};
                `;
        
                connection.query(query, (err, rows) => {
                    if (err) throw err;
                    res.send(rows);
                });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
        });
        
        
        
        /* table insert 순서
        1. post
        2. match
        3. post_has_location
        */
        
        server.post('/api/post/create', (req, res) => {
            try {
                const {
                    uid,
                    selected_sports_category,
                    selected_sports_type,
                    total_guest,
                    selected_location,
                    match_date,
                    match_start_time,
                    match_end_time,
                    match_time_type,
                    selected_place,
                    phone,
                    contents,
                    fee,
                    deposit_account,
                } = req.body.data;
                const query = `
                INSERT INTO \`post\` (user_iduser, type, contents, create_time, source, url)
                VALUES (
                        (SELECT iduser
                        FROM user
                        WHERE fb_uid = "${uid}"),
                        "용병 모집",
                        "${contents}",
                        NOW(),
                        "teamteam",
                        "http://www.teamteam.co");
                `;
                connection.query(query, (err, rows) => {
                    if (err) throw err;
                    console.log(rows);
                    res.send(rows);
                });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
        });
        
        server.post('/api/match/create', (req, res) => { // 경기 생성하기
            try {
                const {
                    uid,
                    selected_sports_category,
                    selected_sports_type,
                    total_guest,
                    selected_location,
                    match_date,
                    match_start_time,
                    match_end_time,
                    match_time_type,
                    selected_place,
                    phone,
                    contents,
                    fee,
                    deposit_account,
                } = req.body.data;
                console.log(req.body.data);
        
                const query = `
                INSERT INTO \`match\`(
                    post_idpost,
                    sports_category,
                    type,
                    fee,
                    total_game_capacity,
                    total_guest,
                    total_applicants,
                    total_participation_confirmed,
                    total_canceled,
                    start_time,
                    end_time,
                    expiration,
                    status,
                    apply_status,
                    place_name,
                    address,
                    bank_account)
                VALUES
                (
                    (SELECT idpost
                    FROM post
                    WHERE user_iduser = (
                        SELECT iduser FROM user WHERE fb_uid = "${uid}")
                        AND type = "용병 모집"
                        AND contents = "${contents}"
                        ORDER BY create_time DESC limit 1
                        ),
                     "${selected_sports_category}",
                     "${selected_sports_type}",
                     "${fee}",
                     "${selected_sports_type * 2}",
                     "${total_guest}",
                     0, 0, 0,
                     "${match_date} ${match_start_time}:00",
                     "${match_date} ${match_end_time}:00",
                     "${match_date} ${match_start_time}:00",
                     "경기 전",
                     "신청 가능",
                     "${selected_place.place_name}",
                     "${selected_place.address_name}",
                     "${deposit_account}"
                );
                `;
        
                connection.query(query, (err, rows) => {
                    if (err) throw err;
                    console.log(rows);
                    res.send(rows);
                });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
        });
        
        server.post('/api/post/create/location', (req, res) => {
            try {
                const {
                    uid,
                    selected_sports_category,
                    selected_sports_type,
                    total_guest,
                    selected_location,
                    match_date,
                    match_start_time,
                    match_end_time,
                    match_time_type,
                    selected_place,
                    phone,
                    contents,
                    fee,
                    deposit_account,
                } = req.body.data;
                console.log(req.body.data);
        
                let query = 'INSERT INTO \`post_has_location\` (post_idpost, location_idlocation) VALUES ';
        
                for (let i = 0; i < selected_location.length; i += 1) {
                    if (i == selected_location.length - 1) {
                        query += `
                        (
                            (SELECT idpost FROM post WHERE user_iduser = (SELECT iduser FROM user WHERE fb_uid = "${uid}")
                               AND type = "용병 모집"
                               AND contents = "${contents}"
                               ORDER BY create_time DESC limit 1
                               ),
                            (
                                SELECT idlocation
                                FROM location
                                WHERE sido_name = "${selected_location[i].sido}"
                                AND sigungu_name = "${selected_location[i].sigungu}"
                            )
                        )
                        `;
                    } else {
                        query += `
                        (
                            (SELECT idpost FROM post WHERE user_iduser = (SELECT iduser FROM user WHERE fb_uid = "${uid}")
                               AND type = "용병 모집"
                               AND contents = "${contents}"
                               ORDER BY create_time DESC limit 1),
                            (
                                SELECT idlocation
                                FROM location
                                WHERE sido_name = "${selected_location[i].sido}"
                                AND sigungu_name = "${selected_location[i].sigungu}"
                            )
                        ),
                        `;
                    }
                }
        
                connection.query(query, (err, rows) => {
                    if (err) throw err;
                    console.log(rows);
                    res.send(rows);
                });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
        });
        
        server.get('/api/post/location', (req, res) => {
            try {
                const data = req.query;
                const sido_name = data.sido_name;
                const sigungu_name = data.sigungu_name;
                console.log('post/location', sido_name);
                console.log('post/location', sigungu_name);
                const query = sigungu_name
                    ? `
                    SELECT * FROM post
                    LEFT JOIN \`match\` ON post.idpost = \`match\`.post_idpost
                    LEFT JOIN post_has_location
                    ON post.idpost = post_has_location.post_idpost
                    WHERE location_idlocation =
                        (
                        SELECT idlocation
                        FROM location
                        WHERE sido_name = '${sido_name}'
                        AND sigungu_name = '${sigungu_name}'
                        )
                    ORDER BY create_time DESC;
                    `
                    : `
                    SELECT * FROM post
                    LEFT JOIN \`match\` ON post.idpost = \`match\`.post_idpost
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
                    res.send(rows);
                });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
        });

        server.get('/api/auth/user', (req, res) => { // get user information from mysql
            try {
                const data = req.query;
                console.log(data);
                const query = `SELECT * FROM \`user\` WHERE fb_uid = '${data.uid}'`;

                connection.query(query, (err, rows) => {
                    if (err) throw err;
                    res.send(rows);
                });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
        });

        server.post('/api/auth/user', (req, res) => { // 최초 회원가입
            try {
                const {
                    fb_uid,
                    email,
                    phone,
                    display_name
                } = req.body.data;
                const query = `INSERT INTO user (fb_uid, email, phone, display_name) VALUES ('${fb_uid}', '${email}', '${phone}', '${display_name}')`;

                connection.query(query, (err, rows) => {
                    if (err) throw err;
                    res.send(rows);
                });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
        });

        server.post('/api/auth/smsVerification', (req, res) => {
            try {
                const phoneNumber = req.body.data.phoneNumber;
                const CERTIFICATION_NUMBER = '123456';
                request.post({
                    json: true,
                    url: `https://api-sens.ncloud.com/v1/sms/services/${nCloud.sms.SERVICE_ID}/messages`,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-NCP-auth-key': `${nCloud.ACCESS_KEY_ID}`,
                        'X-NCP-service-secret': `${nCloud.sms.SERVICE_SECRET_KEY}`
                    },
                    body: {
                        type: 'sms',
                        from: `${nCloud.sms.PHONE_NUMBER}`,
                        to: [`${phoneNumber}`],
                        content: `[teamteam] 인증번호는 ${CERTIFICATION_NUMBER} 입니다.`
                    }
                }, (err, response, body) => {
                    if (err) {
                        res.status(500).json({ err: err.toString() });
                    } else {
                        const messageId = body.messages[0].messageId;
                        request.get({
                            url: `https://api-sens.ncloud.com/v1/sms/services/${nCloud.sms.SERVICE_ID}/messages/${messageId}`,
                            headers: {
                                'X-NCP-auth-key': `${nCloud.ACCESS_KEY_ID}`,
                                'X-NCP-service-secret': `${nCloud.sms.SERVICE_SECRET_KEY}`           
                            }
                        }, (err, response, body) => {
                            if (err) {
                                res.status(500).json({ err: err.toString() });
                            } else {
                                res.send({
                                    body,
                                    certificationNumber: CERTIFICATION_NUMBER,
                                });
                            }
                        })
                    }
                });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }
        });
        
        server.get('*', (req, res) => handle(req, res));

        server.listen(process.env.PORT || 3333, (err) => {
            if (err) {
                throw new Error(err);
            }
            console.log('Server is running on port 3333');
        });
    });