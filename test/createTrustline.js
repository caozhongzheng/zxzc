'use strict'
const http = require('http')
const querystring = require('querystring')
var options = {
	hostname: '127.0.0.1',
	port: 3000,
	path: '/createtrustline',
	method: 'POST',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': 1,
		'Cookie': 'koa:sess=eyJ1c2VycyI6eyJhZGRyZXNzIjoicjFhQ1dEcXhWN05XVVBZOW92UW9OaTF0NHpNcHBzRzJLIiwic2VjcmV0Ijoic3NhUHZndmZ6VVQ1THMyMzRhcjJ3QXR4Y295QWcifX0=; koa:sess.sig=SlQ12swcV0GXTqYs7LD-1HRgDrI'
	}
};
const ary = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'G', 'K', 'L', 'M', 'N'];
var data = {
	zcmc: '星星',
	zcdm: 'ZC',
	zcze: '10000',
	ckjg: '32',
	cslc: '无'
};


let i = 0;

function trustline() {

	data.zcdm = data.zcdm.substr(0, 2) + ary[i];
	let postData = querystring.stringify(data);
	options.headers['Content-Length'] = Buffer.byteLength(postData);
	var req = http.request(options, (res) => {
		console.log(`STATUS: ${res.statusCode}`);
		console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
		res.setEncoding('utf8');
		res.on('data', (chunk) => {
			console.log(`BODY: ${chunk}`);
		});
		req.on('error', (e) => {
			console.log(`problem with request: ${e.message}`);
		});
		res.on('end', () => {
			console.log('No more data in response.');
			i++;
			if (i < ary.length) {
				trustline();
			}
		});
	});
	req.write(postData);
	req.end();
}
trustline()