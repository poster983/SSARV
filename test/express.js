const express = require('express');
ssarv = require('../index.js');
const app = express()

function includeUserArray(req, res, next) {
	req.user = {
		perm: {
        	role: ["admin", "mod"]
        }
	}
	next();
}

function includeUserString(req, res, next) {
	req.user = {
		perm: {
        	role: "admin"
        }
	}
	next();
}

app.get('/array/shouldreturn200', includeUserArray, ssarv(["admin", "mod"], {locationOfRoles: "user.perm.role", failureRedirect: "/fail"}), function (req, res) {
  res.sendStatus(200);
});

app.get('/array/shouldreturn403', includeUserArray, ssarv(["test", "fail"], {locationOfRoles: "user.perm.role", failureRedirect: "/fail"}), function (req, res) {
  res.sendStatus(200);
});

app.get('/string/shouldreturn200', includeUserString, ssarv(["admin", "mod"], {locationOfRoles: "user.perm.role", failureRedirect: "/fail"}), function (req, res) {
  res.sendStatus(200);
});

app.get('/string/shouldreturn403', includeUserString, ssarv(["test", "fail"], {locationOfRoles: "user.perm.role", failureRedirect: "/fail"}), function (req, res) {
  res.sendStatus(200);
});

app.get('/fail', function(req, res) {
	res.sendStatus(403);
})

var server = app.listen(3333, function () {
  console.log('Example app listening on port 3333!')
})

module.exports = server;