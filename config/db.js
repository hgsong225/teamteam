const mysql = {
    local: {
        host: '127.0.0.1',
        user: 'admin',
        password: 'songs0ng@da',
        port: '3306',
        database: 'teamteam-beta'
    },
    production: {
        connectionLimit : 10,
        host     : 'teamteam.cxjiyxodmx6n.ap-southeast-1.rds.amazonaws.com',
        user     : 'admin',
        password : 'lueNdMpHw4okqKytE5Wx',
        port     : 3306,
        database : 'teamteam-production'
    },
    slave: {
        host: '127.0.0.1',
        user: 'teamteam-slave',
        password: 'songs0ng@da',
        port: '3306',
        database: 'teamteam-production'
      },
};

module.exports = mysql.production;

