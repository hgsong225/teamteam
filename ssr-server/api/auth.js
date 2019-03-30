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

// get user information from mysql
router.route('/user')
    .get((req, res) => { 
        try {
            const data = req.query;
            const query = `SELECT * FROM \`user\` WHERE fb_uid = '${data.uid}'`;

            connection.query(query, (err, rows) => {
                if (err) throw err;
                console.log(rows);
                rows[0].gender = rows[0].gender === 'm' ? '남자' : '여자';
                res.send(rows);
            });
        } catch (error) {
            res.status(500).json({ error: error.toString() });
        }
    })
    .post((req, res) => {
        try {
            const {
                fb_uid,
                name,
                email,
                phone,
                display_name
            } = req.body.data;
            console.log(req.body.data);
            const query = `INSERT INTO user (fb_uid, name, email, phone, display_name) VALUES ('${fb_uid}', '${name}', '${email}', '${phone}', '${display_name}')`;
    
            connection.query(query, (err, rows) => {
                if (err) throw err;
                res.send(rows);
            });
        } catch (error) {
            res.status(500).json({ error: error.toString() });
        }
    })
    .put((req, res) => {
        try {
            const {
                displayName,
                email,
                phoneNumber,
                bod,
                gender,
                height,
                weight,
                iduser,
                introduction,
                name,
            } = req.body.data;
            console.log(req.body.data);

            nullCheck = (data) => {
                if (data === null || data === 'null') {
                    return null
                }
                return `'${data}'`;
            }

            const query = `
                update \`user\`
                set
                    display_name = '${displayName}',
                    email = '${email}',
                    phone = '${phoneNumber}',
                    bod = ${nullCheck(bod)},
                    gender = ${nullCheck(gender)},
                    height = ${height},
                    weight = ${weight},
                    introduction = ${nullCheck(introduction)},
                    name = '${name}'
                where iduser = ${iduser};
            `;
    
            connection.query(query, (err, rows) => {
                if (err) throw err;
                res.send(rows);
            });
        } catch (error) {
            res.status(500).json({ error: error.toString() });
        }
    })

router.route('/smsVerification')
    .post((req, res) => {
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


module.exports = router;
