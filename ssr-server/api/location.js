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
    .get((req, res) => { //location 업데이트
        connection.query('SELECT * from location', (err, rows) => {
            if (err) throw err;

            res.send(rows);
        });
    });


module.exports = router;
