# SSARV  
[![Build Status](https://travis-ci.org/poster983/SSARV.svg?branch=master)](https://travis-ci.org/poster983/SSARV) [![codecov](https://codecov.io/gh/poster983/SSARV/branch/master/graph/badge.svg)](https://codecov.io/gh/poster983/SSARV)  

Stupidly Simple Account Role Verifier - Express middleware that checks if the user has the correct permission role.  

## Install
`npm install ssarv`

## Use: 

For use with express.

### Syntex 

`ssarv(requiredRoles, opt)`

"requiredRoles" is an array of roles allowed

"opt" is a json object.
Current valid "opt" keys: 
```
opt = {
	locationOfRoles: "req.user.perm.role", //(required)
	failureRedirect: "/auth/login" //(optional)
}
```

### Example: 
```javascript
//express stuff here 
var ssarv = require('ssarv');

app.get('/adminsAndDevsOnly', ssarv(["admin", "dev"], {
	locationOfRoles: "req.user.account.role",
	failureRedirect: "/auth/login"
}), function(req, res, next) {
	//Do Something 
});

```
