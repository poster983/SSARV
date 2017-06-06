/*
The MIT License (MIT)

Copyright (c) 2017 Joseph Hassell

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var ssarv = require('./index.js');
var httpMocks = require('node-mocks-http');
var server = require('./test/express.js');
var request = require('request');
request.get('http://localhost:3333/shouldreturn200', function(error, response, body) {
							//assert.equal(response.statusCode, 200);
							console.log(response.statusCode)
							done();

						})

function done(err) {
	server.close();
}

/*
var req = {};
var res = {};

req = httpMocks.createRequest({
		        method: 'GET',
		        url: '/admin?myid=123456789',
		        user: {
		        	name: "Tester",
		        	perm: {
		            	role: ["admin", "mod"]
		            }
		        }
		    });
		    res = httpMocks.createResponse();


console.log(tester());
function tester(callback) {
return ssarv(["admin", "mod"], {locationOfRoles: "user.perm.role", failureRedirect: "/auth/login"})(req, res, function(err) {
	console.log("run")
		if(err) {
			return done(err);
		} else {
			return done("done");
		}
	});
}

function done(err) {
	console.log("Resp:")
	console.log(err);
}

		    /*
var locDone = false;

var syncFun = function(allowedRoles, opt, reqs, ress) {
	ssarv(allowedRoles, opt)(req, res, function(err, resulting) {
		if(err) {
			return err;
		}
		console.log(resulting);
		return resulting;
	});
};
	/*
	ssarv(["admin", "mod"], {locationOfRoles: "user.perm.role", failureRedirect: "/auth/login"})(req, res, function(err) {
		if(err) {
			return done(err);
		}
		return done(new Error("Redirect Failed"));
	});*/
/*
	void sync([syncFun(["admins", "mods"], {locationOfRoles: "user.perm.role", failureRedirect: "/auth/login"}, reqs, ress)], function(a,b) {
		console.log("ran");
		console.log(a);
		console.log(b)
	})
	*/
/*

function waiting() {
	setTimeout(function() {
		console.log("Hello");
	}, 10000);
};

function call(a, b, callback) {
	setTimeout(function() {
		return callback(null, a+b);
	}, 3000);
}
/*
Sync(function() {
	console.log("hello");

	waiting.sync(null);

	console.log(call.sync(null,1,2))
}, function(err, result) {
	if (err) console.error(err)
		//console.log(result)
});*/