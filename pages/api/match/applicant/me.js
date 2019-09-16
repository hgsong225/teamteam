const mysql = require('mysql');

const db = require('../../../../config/db.js');

const connection = mysql.createConnection(db);

export default (req, res) => {
    const {
    method
    } = req

    switch (method) {
        case 'GET':
        // Get data from your database
            try {
                const data = req.query;
                
                // 내가 신청한 모든 경기의  match_has_user table 데이터 가져오기 // all
                const getAllDataIHadApplied = `
                SELECT * FROM match_has_user
                    WHERE user_iduser = '${data.iduser}'
                `;

                // 내가 신청한 한 경기의 match_has_user table 데이터 가져오기 // one
                const getDataAboutTheMatchIHadApplied = `
                SELECT * FROM match_has_user
                    WHERE user_iduser = '${data.iduser}'
                    AND match_idmatch = '${data.idmatch}'
                `;

                // 주문번호에 따른 match_has_user table과 해당 match 데이터 가져오기 // order_number
                const getDataByOrderNumber = `
                SELECT * FROM match_has_user
                LEFT JOIN \`match\` ON match_idmatch = idmatch
                    where user_iduser = '${data.iduser}'
                    and order_number = '${data.order_number}'
                `;

                let query;
                if (data.need = 'all') query = getAllDataIHadApplied;
                if (data.need = 'one') query = getDataAboutTheMatchIHadApplied;
                if (data.need = 'order_number') query = getDataByOrderNumber;

                connection.query(query, (err, rows) => {
                    if (err) throw err;
                    console.log(`rows`, rows);
                    const result = rows.reduce((total, {
                        idmatch_has_user,
                        user_iduser,
                        apply_time,
                        depositor,
                        phone,
                        match_has_user_fee,
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
                        guests_to_play,
                        order_number,
                        ...data
                    }) => {
                        if (!total[data.post_idpost]) {
                            total[data.post_idpost] = data;
                            total[data.post_idpost].match_has_users = [];
                        }
                        total[data.post_idpost].match_has_users.push({
                            idmatch_has_user,
                            user_iduser,
                            apply_time,
                            depositor,
                            phone,
                            match_has_user_fee,
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
                            guests_to_play,
                            order_number,
                        })
                        return total;
                    }, {});
                    res.send(Object.values(result));
                });
            } catch (error) {
                res.status(500).json({ error: error.toString() });
            }

        break

        case 'POST':
        // Create data in your database
   
        res.status(200).json({ message: 'POST 요청' });

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