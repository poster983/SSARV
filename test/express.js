const express = require('express');
ssarv = require('../index.js');
const app = express()

function includeUser(req, res, next) {
	req.user = {
		perm: {
        	role: ["admin", "mod"]
        }
	}
	next();
}

app.get('/shouldreturn200', includeUser, ssarv(["admin", "mod"], {locationOfRoles: "user.perm.role", failureRedirect: "/fail"}), function (req, res) {
  res.sendStatus(200);
});

app.get('/shouldreturn403', includeUser, ssarv(["test", "fail"], {locationOfRoles: "user.perm.role", failureRedirect: "/fail"}), function (req, res) {
  res.sendStatus(200);
});

app.get('/fail', function(req, res) {
	res.sendStatus(403);
})

var server = app.listen(3333, function () {
  console.log('Example app listening on port 3333!')
})

module.exports = server;