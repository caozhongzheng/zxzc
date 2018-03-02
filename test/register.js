'use strict';

const request = require('request');


var form = {
	enterprisename: '众享比特',
	registernubmer: '323',
	corporation: '342',
	address: '343',
	telephone: '13244343432',
	personaddress: '打开',
	password1: '1111qqqq',
	password2: '1111qqqq',
}
var i = 0;
function register(){
	request.post('http://127.0.0.1:3000/register', {
		form: form
	}, function(err, httpResponse, body) {
		console.log(err);
		i++;
		if(i<100){
			register();
		}
		
	})
}
register()