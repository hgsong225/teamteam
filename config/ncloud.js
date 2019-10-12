const CryptoJS = require('crypto-js');

const nCloud = {
    ACCESS_KEY_ID: 'MzpcKhAOVEuYxrMi33di',
    SECRET_KEY: '76rAGZCuhWFVD4DkbF6euREU4djWSchrNIDfx4T2',
    sms: {
          SERVICE_ID: 'ncp:sms:kr:255179524406:teamteam',
          SERVICE_SECRET_KEY: '3b302a37fe224d469ef08469ab1a0e1f',
          PHONE_NUMBER: '01028833742',
    },
};

const makeSignature = () => {
	let space = " ";				// one space
	let newLine = "\n";				// new line
	let method = "GET";				// method
	let url = "/photos/puppy.jpg?query1=&query2";	// url (include query string)
	let timestamp = `${Date.now()}`;			// current timestamp (epoch)
    
    let accessKey = `${nCloud.ACCESS_KEY_ID}`			// access key id (from portal or sub account)
	let secretKey = `${nCloud.SECRET_KEY}`;			// secret key (from portal or sub account)

	let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
        hmac.update(method);
        hmac.update(space);
        hmac.update(url);
        hmac.update(newLine);
        hmac.update(timestamp);
        hmac.update(newLine);
        hmac.update(accessKey);

	let hash = hmac.finalize();

	return hash.toString(CryptoJS.enc.Base64);
}

nCloud.SIGNATURE = makeSignature();
console.log(nCloud);


module.exports = nCloud;