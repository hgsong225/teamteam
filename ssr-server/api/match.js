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

/* prcoessing router */


/* ROUTERS */
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

    router.route('/create')
    .post((req, res) => { // 경기 생성하기
        try {
            const {
                uid,
                selected_location,
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

            let postQuery = `
            INSERT INTO \`post\` (user_iduser, post_type, contents, create_time, source, url)
            VALUES (
                    (SELECT iduser
                    FROM user
                    WHERE fb_uid = "${uid}"),
                    "용병모집",
                    "${contents}",
                    NOW(),
                    "teamteam",
                    "http://www.teamteam.co");
            `;

            let post_has_locationQuery = `INSERT INTO \`post_has_location\` (post_idpost, location_idlocation) VALUES `;
            
            connection.beginTransaction((err) => {
                if (err) throw err;
                
                connection.query(postQuery, (err, rows) => {
                    if (err) {
                        console.log(err);
                        connection.rollback(() => { throw err; });
                    }
                    const selectIdpost = `
                    SELECT idpost FROM post WHERE user_iduser = (SELECT iduser FROM user WHERE fb_uid = "${uid}")
                                    AND post_type = "용병모집"
                                    AND contents = "${contents}"
                                    ORDER BY create_time DESC limit 1
                    `;
                    connection.query(selectIdpost, (err, rows) => {
                        if (err) {
                            connection.rollback(() => { throw err; });
                        }
                        const idpost = rows[0].idpost;
                        console.log(`idpost`, idpost);
                        const matchQuery = `
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
                            ${idpost},
                            "${selected_sports_category}",
                            "${selected_sports_type}",
                            "${fee}",
                            "${selected_sports_type * 2}",
                            "${total_guest}",
                            "${match_date} ${match_start_time}:00",
                            "${match_date} ${match_end_time}:00",
                            "경기 전",
                            "신청가능",
                            "${selected_place.place_name}",
                            "${selected_place.address_name}",
                            "${deposit_account}"
                        );
                        `;
                        connection.query(matchQuery, (err, rows) => {
                            if (err) {
                                console.log(err);
                                connection.rollback(() => { throw err; })
                            }
                            console.log(`rows`, rows);
                            for (let i = 0; i < selected_location.length; i += 1) {
                                if (i == selected_location.length - 1) {
                                    post_has_locationQuery += `
                                    (
                                        ${idpost},
                                        (
                                            SELECT idlocation
                                            FROM location
                                            WHERE sido_name = "${selected_location[i].sido}"
                                            AND sigungu_name = "${selected_location[i].sigungu}"
                                        )
                                    )
                                    `;
                                } else {
                                    post_has_locationQuery += `
                                    (
                                        ${idpost},
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
    
                            connection.query(post_has_locationQuery, (err, rows) => {
                                if (err) {
                                    connection.rollback(() => { throw err; });
                                }
                                
                                connection.commit((err) => {
                                    if (err) {
                                        connection.rollback(() => {throw err; });
                                    }
                                    console.log('Transactio Completed');
                                })
                                res.send({ idpost, });
                            });
                        })
                    });
                });
            })
        } catch (error) {
            res.status(500).json({ error: error.toString() });
        }
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
            console.log(data, data.selected_location);
            const matchQuery = `
                UPDATE \`match\` 
                SET    host_account = '${data.deposit_account}', 
                       match_fee = ${data.fee}, 
                       sports_category = '${data.selected_sports_category}', 
                       match_type = ${data.selected_sports_type}, 
                       total_game_capacity = ${data.selected_sports_type * 2}, 
                       total_guest = ${data.total_guest}, 
                       start_time = '${data.match_date} ${data.match_start_time}', 
                       end_time = '${data.match_date} ${data.match_end_time}',
                       place_name = '${data.selected_place.place_name}',
                       address = '${data.selected_place.address_name}'
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

    // 매치 취소
    router.route('/cancel')
    .post((req, res) => {
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
    })

router.route('/apply')
    .post((req, res) => { // 매치 신청
        try {
            const data = req.body.data;
            console.log('DATA', data);
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

router.route('/apply/cancel')
    .post((req, res) => { // 게스트 매치 신청 취소
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
                    // 24시간 넘었는지 확인
                    if (timeDiff > 86400) {
                        query2 = `
                            update match_has_user
                            set applicant_status = '신청취소',
                                cancel_time = NOW(),
                                cancel_type = '신청취소',
                                reason_for_cancel = '게스트(신청취소)',
                                refund_status = case when payment_status = '결제전' then '환불완료' when payment_status = '결제완료' then '환불완료' end,
                                refund_fee_rate = case when payment_status = '결제전' then 0 when payment_status = '결제완료' then 0 end,
                                refund_fee = case when payment_status = '결제전' then 0 when payment_status = '결제완료' then 0 * ${rows[0].amount_of_payment} end
                            where user_iduser = (select iduser from user where fb_uid = '${data.uid}')
                        `;
                    }
                    if (timeDiff <= 86400 && timeDiff > 0) {
                        query2 = `
                            update match_has_user
                            set applicant_status = '신청취소',
                                cancel_time = NOW(),
                                cancel_type = '신청취소',
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
    });

router.route('/applicant/me')
    .get((req, res) => {
        try {
            const data = req.query;
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
    })
    .post((req, res) => { // 매치 신청자 정보 업데이트
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
    });

    
router.route('/me')
    .get((req, res) => { // 내가 생성한 경기 불러오기 (생성한)
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
    .get((req, res) => { // 내가 신청한 경기만 불러오기
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