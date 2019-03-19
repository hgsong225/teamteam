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
    connection.query('SELECT * FROM post', (err, rows) => {
        if (err) throw err;

        res.send(rows);
    });
  });

router.route('/create')
  .post((req, res) => {
    try {
        const {
            uid,
            contents,
        } = req.body.data;
        const query = `
        INSERT INTO \`post\` (user_iduser, post_type, contents, create_time, source, url)
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
            res.send(rows);
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
  });

router.route('/create/location')
  .post((req, res) => {
    try {
        const {
            uid,
            selected_location,
            contents,
        } = req.body.data;

        let query = 'INSERT INTO \`post_has_location\` (post_idpost, location_idlocation) VALUES ';

        for (let i = 0; i < selected_location.length; i += 1) {
            if (i == selected_location.length - 1) {
                query += `
                (
                    (SELECT idpost FROM post WHERE user_iduser = (SELECT iduser FROM user WHERE fb_uid = "${uid}")
                      AND post_type = "용병 모집"
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
                      AND post_type = "용병 모집"
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
            res.send(rows);
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
  });

router.route('/location')
  .get((req, res) => {
    try {
        const data = req.query;
        const sido_name = data.sido_name;
        const sigungu_name = data.sigungu_name;
        const query = sigungu_name
            ? `
            SELECT * FROM post
            LEFT JOIN \`match\` ON post.idpost = \`match\`.post_idpost
            LEFT JOIN match_has_user ON \`match\`.idmatch = match_has_user.match_idmatch
            LEFT JOIN user ON user.iduser = match_has_user.user_iduser
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

module.exports = router;