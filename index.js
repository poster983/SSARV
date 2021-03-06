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

module.exports = function(requiredRoles, opt) {
  return function(req, res, next) {
    recursiveArray(opt.locationOfRoles.split("."), req, function(err, role) {
        if(err) {
        	
        	return next(err);
        }
        
        
        if (Array.isArray(role)) {
        	for(x = 0; x < requiredRoles.length; x++) {
        		if (role.indexOf(requiredRoles[x]) != -1) {
        			return next();
        		}    		
        	}
        	if(opt.failureRedirect) {
                return res.redirect(opt.failureRedirect);
                
            } else {
                var err = new Error("Forbidden");
                    err.status = 403;
                    return next(err);
            }
    	} else {
            for(x = 0; x < requiredRoles.length; x++) {
                if(requiredRoles[x] == role) {
                    return next();
                }
            }
            if(opt.failureRedirect) {
                return res.redirect(opt.failureRedirect);
                
            } else {
                var err = new Error("Forbidden");
                    err.status = 403;
                    return next(err);
            }
        }
	});
  }
}

function recursiveArray(array, jsonObj, callback) {
	if(array.length < 1 ) {
        if(jsonObj == undefined) {
            var err = new Error("BAD REQUEST: Nothing found at the JSON path");
            err.status = 400;
            return callback(err, jsonObj);
        } else {
            return callback(null, jsonObj);
        }
    }
	try{
		jsonObj = jsonObj[array[0]];
	} catch(err) {
		//var err = new Error(err)
		err.status = 400;
		return callback(err); 
	} 
	return recursiveArray(array.slice(1), jsonObj, callback);
}

/*

requiredRoles is an array of roles allowed

opt is a json objust for future proofing 
```
opt = {
	locationOfRoles: "req.user.perm.role",
	failureRedirect: "/auth/login"
	
}
```
*/