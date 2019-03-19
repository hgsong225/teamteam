const express = require('express');
const next = require('next');
const mysql = require('mysql');
var cors = require('cors');
const request = require('request');

const dbConfig = require('../config/db.js');
const nCloud = require('../config/ncloud.js');

const match = require('./api/match');
const auth = require('./api/auth');
const post = require('./api/post');
const location = require('./api/location');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
    .then(() => {
        const server = express();

        server.use(express.static('static'));
        server.use(cors());
        server.use(express.json());
        
        server.use('/api/match', match);
        server.use('/api/auth', auth);
        server.use('/api/post', post);
        server.use('/api/location', location);

        server.post('/test', (req, res) => {
            res.send(req.body);
        });

        server.get('*', (req, res) => handle(req, res));

        server.listen(process.env.PORT || 3333, (err) => {
            if (err) {
                throw new Error(err);
            }
            console.log('Server is running on port 3333');
        });
    });
