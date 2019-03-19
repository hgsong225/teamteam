const express = require('express');
const router = express.Router();
const next = require('next');
const mysql = require('mysql');
var cors = require('cors');
const request = require('request');

const dbConfig = require('../../config/db.js');
const nCloud = require('../../config/ncloud.js');

const connection = mysql.createConnection(dbConfig);


// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.route('/')
    .get((req, res) => {
        try {
            const data = req.query;
            const query = `
            SELECT * FROM post
            LEFT JOIN \`match\`
                ON post.idpost = \`match\`.post_idpost
            LEFT JOIN user ON user.iduser = post.user_iduser
                WHERE post_idpost = ${data.id};
            `;

            connection.query(query, (err, rows) => {
                if (err) throw err;
                res.send(rows);
            });
        } catch (error) {
            res.status(500).json({ error: error.toString() });
        }
    });

router.route('/api/match/create')
    .post((req, res) => { // 경기 생성하기
        try {
            const {
                uid,
                selected_sports_category,
                selected_sports_type,
                total_guest,
                match_date,
                match_start_time,
                match_end_time,
                selected_place,
                contents,
                fee,
                deposit_account,
            } = req.body.data;

            const query = `
            INSERT INTO \`match\`(
                post_idpost,
                sports_category,
                match_type,
                match_fee,
                total_game_capacity,
                total_guest,
                start_time,
                end_time,
                match_status,
                apply_status,
                place_name,
                address,
                host_account)
            VALUES
            (
                (SELECT idpost
                FROM post
                WHERE user_iduser = (
                    SELECT iduser FROM user WHERE fb_uid = "${uid}")
                    AND post_type = "용병 모집"
                    AND contents = "${contents}"
                    ORDER BY create_time DESC limit 1
                    ),
                    "${selected_sports_category}",
                    "${selected_sports_type}",
                    "${fee}",
                    "${selected_sports_type * 2}",
                    "${total_guest}",
                    "${match_date} ${match_start_time}:00",
                    "${match_date} ${match_end_time}:00",
                    "경기 전",
                    "신청 가능",
                    "${selected_place.place_name}",
                    "${selected_place.address_name}",
                    "${deposit_account}"
            );
            `;

            connection.query(query, (err, rows) => {
                if (err) throw err;
                res.send(rows);
            });
        } catch (error) {
            res.status(500).json({ error: error.toString() });
        }
    });

router.route('/apply')
    .post((req, res) => { // 매치 신청
        try {
            const data = req.body.data;
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
    });

router.route('/applicant/me')
    .get((req, res) => {
        try {
            const data = req.query;
            console.log(data, 'hey');
            const query = `
            SELECT * FROM match_has_user
                WHERE user_iduser =
                    (SELECT iduser
                        FROM user
                        WHERE fb_uid = '${data.uid}')
                AND match_idmatch = '${data.idmatch}'
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

router.route('/applicants')
    .get((req, res) => { // 해당 매치 전체 신청자 가져오기
        try {
            const data = req.query;
            const query = `
            SELECT * FROM post
            LEFT JOIN \`match\` ON post.idpost = \`match\`.post_idpost
            LEFT JOIN match_has_user ON \`match\`.idmatch = match_has_user.match_idmatch
            LEFT JOIN user ON user.iduser = match_has_user.user_iduser
                WHERE post_idpost = ${data.id} AND match_has_user.user_iduser !=
                    (SELECT iduser
                    FROM user
                    WHERE fb_uid = '${data.uid}');
            `;
    
            connection.query(query, (err, rows) => {
                if (err) throw err;
                res.send(rows);
            });
        } catch (error) {
            res.status(500).json({ error: error.toString() });
        }
    });
    
router.route('/me')
    .get((req, res) => { // 내 모든 경기 불러오기 (생성, 신청한 경기 등 모두)
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
    })
    .delete((req, res) => {
        try {
            const { idpost } = req.query;
            console.log(req.query);
            const query = `DELETE FROM post WHERE idpost = '${idpost}'`;
    
            connection.query(query, (err, rows) => {
                if (err) throw err;
                res.send(rows);
            });
        } catch (error) {
            res.status(500).json({ error: error.toString() });
        }
    });

router.route('/me/apply')
    .get((req, res) => { // 내가 신청한 경기 불러오기
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
    })
    .post((req, res) => { // 신청했던 경기 업데이트
        try {
            const data = req.body.data;
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

module.exports = router;