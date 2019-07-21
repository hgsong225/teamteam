const express = require('express');
const router = express.Router();
const next = require('next');
const mysql = require('mysql');
var cors = require('cors');
const request = require('request');

const DB_LOCAL = require('../../config/db.js').local;
const DB_PRODUCTION = require('../../config/db.js').production;
const nCloud = require('../../config/ncloud.js');

const connection = mysql.createConnection(DB_PRODUCTION);


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

router.route('/location')
  .get((req, res) => {
    try {
        const data = req.query;
        console.log(data);
        const sido_name = data.sido_name;
        const sigungu_name = data.sigungu_name;
        const query = sigungu_name
            ? `
            SELECT *, p.user_iduser as hostID FROM post p
            LEFT JOIN \`match\` ON p.idpost = \`match\`.post_idpost
            LEFT JOIN match_has_user ON \`match\`.idmatch = match_has_user.match_idmatch
            LEFT JOIN user ON user.iduser = match_has_user.user_iduser
            LEFT JOIN post_has_location
            ON p.idpost = post_has_location.post_idpost
            WHERE location_idlocation =
                (
                SELECT idlocation
                FROM location
                WHERE sido_name = '${sido_name}'
                AND sigungu_name = '${sigungu_name}'
                )
            AND apply_status ='신청가능'
            ORDER BY create_time DESC;
            `
            : `
            SELECT *, p.user_iduser as hostID FROM post p
            LEFT JOIN \`match\` ON p.idpost = \`match\`.post_idpost
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
            const result = rows.reduce((total, {
              iduser,
              fb_uid,
              phone,
              bod,
              height,
              weight,
              name,
              display_name,
              introduction,
              gender,
              email,
              match_idmatch,
              apply_time,
              depositor,
              bank_account,
              match_has_user_fee,
              applicant_status,
              amount_of_payment,
              payment_status,
              payment_method,
              payment_time,
              cancel_type,
              cancel_time,
              reason_for_cancel,
              commission_rate,
              commission,
              refund_status,
              refund_fee_rate,
              refund_fee,
              ...data
            }) => {
              if (!total[data.idpost]) {
                total[data.idpost] = data;
                total[data.idpost].match_has_users = [];
              }
              total[data.idpost].match_has_users.push({
                iduser,
                fb_uid,
                phone,
                bod,
                height,
                weight,
                name,
                display_name,
                introduction,
                gender,
                email,
                match_idmatch,
                apply_time,
                depositor,
                bank_account,
                match_has_user_fee,
                applicant_status,
                amount_of_payment,
                payment_status,
                payment_method,
                payment_time,
                cancel_type,
                cancel_time,
                reason_for_cancel,
                commission_rate,
                commission,
                refund_status,
                refund_fee_rate,
                refund_fee,
              });
              return total;
            }, {});
            res.send(Object.values(result));
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
  });

router.route('/locations')
  .get((req, res) => {
    try {
        const data = req.query;
        const query = `select location_idlocation from post_has_location where post_idpost = ${data.id}`;

        /* Begin transaction */
        connection.beginTransaction((err) => {
            if (err) { throw err; }
            connection.query(query, (err, result) => {
                if (err) { 
                    connection.rollback(() => { throw err; });
                }
                let query2 = `select idlocation, sido_name, sigungu_name from location where idlocation in (`;
                for (let i = 0; i < result.length; i += 1) {
                  if (i == result.length - 1) {
                    query2 += `${result[i].location_idlocation});`;
                  } else {
                    query2 += `${result[i].location_idlocation},`;
                  }
                }
                connection.query(query2, (err, result) => {
                  if (err) { 
                    connection.rollback(() => { throw err; });
                  }
                  connection.commit((err) => {
                    if (err) { 
                        connection.rollback(() => { throw err; });
                    }
                    console.log('Transaction Complete.');
                  });
                  res.send(result);
                });
            })
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = router;