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
    .get((req, res) => { //location 업데이트
        const query = `SELECT * FROM location order by sido_code asc, sigungu_name asc;`;
        connection.query(query, (err, rows) => {
            if (err) throw err;

            res.send(rows);
        });
    });

module.exports = router;
