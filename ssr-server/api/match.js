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

router.route('/edit')
    .post((req, res) => {
        try {
            const data = req.body.data;
            const postQuery = `
                update post
                set contents = '${data.contents}', edit_time = NOW()
                where idpost = ${data.idpost};
            `;

            const matchQuery = `
                UPDATE \`match\` 
                SET    host_account = '${data.deposit_account}', 
                       match_fee = ${data.fee}, 
                       sports_category = '${data.selected_sports_category}', 
                       match_type = ${data.selected_sports_type}, 
                       total_game_capacity = ${data.selected_sports_type * 2}, 
                       total_guest = ${data.total_guest}, 
                       start_time = '${data.match_date} ${data.match_start_time}', 
                       end_time = '${data.match_date} ${data.match_end_time}'
                       place_name = '${data.selected_location.place_name}',
                       address = '${data.selected_location.address_name}'
                WHERE  post_idpost = ${data.idpost}
                AND    idmatch = ${data.idmatch};
            `;

            const delete_post_has_locationQuery = `
                DELETE 
                FROM   post_has_location 
                WHERE  post_idpost = ${data.idpost};
            `;

            let post_has_locationQuery = `
                INSERT INTO post_has_location 
                (post_idpost, 
                 location_idlocation) 
                VALUES 
            `;

            /* Begin transaction */
            connection.beginTransaction((err) => {
                if (err) { throw err; }
                connection.query(postQuery, (err, result) => {
                    if (err) {
                        console.log(err);
                        connection.rollback(() => { throw err; });
                    }

                    connection.query(matchQuery, (err, result) => {
                        if (err) {
                            console.log(err);
                            connection.rollback(() => { throw err; });
                        }

                        connection.query(delete_post_has_locationQuery, (err, result) => {
                            if (err) {
                                console.log(err);
                                connection.rollback(() => { throw err; });
                            }

                            for (let i = 0; i < data.selected_location.length; i += 1) {
                                if (i == data.selected_location.length - 1) {
                                    post_has_locationQuery += `(${data.idpost}, ${data.selected_location[i].idlocation});`;
                                } else {
                                    post_has_locationQuery += `(${data.idpost}, ${data.selected_location[i].idlocation}), `
                                }
                            }

                            connection.query(post_has_locationQuery, (err, result) => {
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
                            });
                        });
                    });
                });
            });
            /* End transaction */
        } catch (error) {
            res.status(500).json({ error: error.toString() });
        }
    });

router.route('/')
    .get((req, res) => {
        try {
            const data = req.query;
            console.log('data', data);
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

router.route('/create')
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
    })
    .post((req, res) => { // 매치 신청자 정보 업데이트
        try {
            const data = req.body.data;
            let query = '';
            console.log('fuck', data);
            
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

            console.log(query);
    
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
                    AND \`post\`.post_type = '용병모집'
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

module.exports = router;