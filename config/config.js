'use strict'

global.config = {
	port: process.env.PORT || 3000,
	rippleServerIp: 'ws://101.201.40.124:5006',
	// rippleServerIp: 'ws://127.0.0.1:6004',
	rippleAddress: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
	rippleSecret: 'snoPBrXtMeMyMHUVTgbuqAfg1SUTb',
	zxcAddress: 'rnpCj2cTspBrgvuTkpuy3fPv6w8xvgPDW1',
	zxcSecret: 'spmLT7Y3C4muLnh1ZB5MRvfNiwSVq',
	assetAddress:'r3mfjc6RNvbKipNswskxaEHeB9wygAMDZL',
	assetSecret:'saBVKjxg8V8KUXTB4EM1xk4v3vnSy',
	tag: {
		'create': 1,
		'register':2,
		'expansion':3,
		'transfer':4
	}
};