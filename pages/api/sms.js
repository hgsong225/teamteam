const mysql = require('mysql');
const request = require('request');

const db = require('../../config/db.js');
const nCloud = require('../../config/ncloud.js');

const connection = mysql.createConnection(db);

export default (req, res) => {
    const {
        method
    } = req;

    let randomNum = {};
    //0~9까지의 난수
    randomNum.random = (n1, n2) => {
        return parseInt(Math.random() * (n2 -n1 +1)) + n1;
    };
    //인증번호를 뽑을 난수 입력 n 5이면 5자리
    randomNum.authNo = (n) => {
        let value = "";
        for (let i = 0; i < n; i++) {
            value += randomNum.random(0,9);
        }
        return value;
    };

    switch (method) {
        case 'GET':
        // Get data from your database

        res.status(200).json({ })

        break

        case 'POST':
        // Create data in your database
        try {
            const phoneNumber = req.body.data.phoneNumber;
            const CERTIFICATION_NUMBER = randomNum.authNo(6);

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

        break

        case 'PUT':
        // Update data in your database

        res.status(200).json({ });

        break

        case 'DELETE':
        // Delete data from your database

        res.status(200).json({ });
        
        break

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
            res.status(405).end(`Method ${method} Not Allowed`)
        }
}