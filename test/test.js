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
var ssarv = require('../index.js');
var server = require('./express.js');
var request = require('request');
var httpMocks = require('node-mocks-http');
var chai = require('chai');
var assert = chai.assert;
var req = {}; // define REQUEST
var res = {};// define RESPONSE




function handleError(done, fn) {
    try { // boilerplate to be able to get the assert failures
        fn();
        done();
    } catch (error) {
    	console.log(error)
        done(error);
    }
}

describe("Tests with express server", function() {
	after(function() {
		server.close();
	});
	context("The \"failureRedirect\" option is set to redirect to \"/fail\"", function() {
		describe("User in the \"req\" object has a role value of: \"[\"admin\", \"mod\"].\"", function() {
			context("The \"locationOfRoles\" JSON key has a value of: \"user.perm.role\"", function() {
				context("The required role array has a value of: \"[\"admin\", \"mod\"].\"", function() {
					it("should return a 200", function(done) {
						request.get('http://localhost:3333/array/shouldreturn200', function(error, response, body) {
							assert.equal(response.statusCode, 200);
							done();
						})
					})
				});

				context("The required role array has a value of: \"[\"test\", \"fail\"].\"", function() {
					it("should return a 403", function(done) {
						request.get('http://localhost:3333/array/shouldreturn403', function(error, response, body) {
							assert.equal(response.statusCode, 403);
							done();
						})
					})
				});
			});
		});


		describe("User in the \"req\" object has a role value of: \"admin\".", function() {
			context("The \"locationOfRoles\" JSON key has a value of: \"user.perm.role\"", function() {
				context("The required role array has a value of: \"[\"admin\", \"mod\"].\"", function() {
					it("should return a 200", function(done) {
						request.get('http://localhost:3333/string/shouldreturn200', function(error, response, body) {
							assert.equal(response.statusCode, 200);
							done();
						})
					})
				});

				context("The required role array has a value of: \"[\"test\", \"fail\"].\"", function() {
					it("should return a 403", function(done) {
						request.get('http://localhost:3333/string/shouldreturn403', function(error, response, body) {
							assert.equal(response.statusCode, 403);
							done();
						})
					})
				});
			});
		});
	});
})


describe("User in the \"req\" object has a role value of: \"[\"admin\", \"mod\"].\"", function() {
	before(function(dones) {
		    /* 
		     * before each test, reset the REQUEST and RESPONSE variables 
		     * to be send into the middle ware
		    **/
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
		    
		    dones(); // call done so that the next test can run
		});
	context("The required role array has a value of: \"[\"admin\", \"mod\"].\"", function() {
		context("The \"locationOfRoles\" JSON key has a value of: \"user.perm.role\"", function() {
			it('should return no error', function(done) {
				ssarv(["admin", "mod"], {locationOfRoles: "user.perm.role"})(req, res, function(err) {
					if(err) {
						done(err);
					} else {
						done();
					}
				});
				
			})
		})
		context("The \"locationOfRoles\" JSON key has a value of: \"user.role\"", function() {
			it('should error because \"locationOfRoles\" is invalid', function(done) {
				ssarv(["admin", "mod"], {locationOfRoles: "user.role"})(req, res, function(err) {
					
					if(err) {
						assert.equal(err.status, 400);
						done();
					} else {
						done(new Error("Did not return an error."));
					}
				});
				
			})
		})
	})
	//______
	context("The required role array has a value of: \"[\"dev\", \"mod\"].\"", function() {
		context("The \"locationOfRoles\" JSON key has a value of: \"user.perm.role\"", function() {
			it('should return no error because the module uses OR logic', function(done) {
				ssarv(["dev", "mod"], {locationOfRoles: "user.perm.role"})(req, res, function(err) {
					if(err) {
						done(err);
					} else {
						done();
					}
				});
				
			})
		})
	})

	context("The required role array has a value of: \"[\"mod\", \"random\"].\"", function() {
		context("The \"locationOfRoles\" JSON key has a value of: \"user.perm.role\"", function() {
			it('should return no error because the module uses OR logic', function(done) {
				ssarv(["mod", "random"], {locationOfRoles: "user.perm.role"})(req, res, function(err) {
					if(err) {
						done(err);
					} else {
						done();
					}
				});
				
			})
		})
	})
	//______
	context("The required role array has a value of: \"[\"fail\", \"group\"].\"", function() {
		context("The \"locationOfRoles\" JSON key has a value of: \"user.perm.role\"", function() {
			it('should return 403 \"Forbidden\", because user does not have these roles', function(done) {
				ssarv(["fail", "group"], {locationOfRoles: "user.perm.role"})(req, res, function(err) {
					if(err) {
						assert.equal(err.status, 403);
						done();
					} else {
						done(new Error("Did not return an error."));
					}
				});
				
			})
		})
	})
})

describe("User in the \"req\" object has a role value of: \"admin\".", function() {
	before(function(dones) {
	    /* 
	     * before each test, reset the REQUEST and RESPONSE variables 
	     * to be send into the middle ware
	    **/
	    req = httpMocks.createRequest({
	        method: 'GET',
	        url: '/admin?myid=123456789',
	        user: {
	        	name: "Tester",
	        	perm: {
	            	role: "admin"
	            }
	        }
	    });
	    res = httpMocks.createResponse();
	    
	    dones(); // call done so that the next test can run
	});

	context("The required role array has a value of: \"[\"admin\", \"mod\"].\"", function() {
		context("The \"locationOfRoles\" JSON key has a value of: \"user.perm.role\"", function() {
			it('should return no error', function(done) {
				ssarv(["admin", "mod"], {locationOfRoles: "user.perm.role"})(req, res, function(err) {
					if(err) {
						done(err);
					} else {
						done();
					}
				});
				
			})
		})
		context("The \"locationOfRoles\" JSON key has a value of: \"user.role\"", function() {
			it('should return 400 because \"locationOfRoles\" is invalid', function(done) {
				ssarv(["admin", "mod"], {locationOfRoles: "user.role"})(req, res, function(err) {
					
					if(err) {
						assert.equal(err.status, 400);
						done();
					} else {
						done(new Error("Did not return an error."));
					}
				});
				
			})
		})

		context("The \"locationOfRoles\" JSON key has a value of: \"req.user.role\"", function() {
			it('should return 400 because \"locationOfRoles\" is invalid', function(done) {
				ssarv(["admin", "mod"], {locationOfRoles: "req.user.role"})(req, res, function(err) {
					if(err) {
						assert.equal(err.status, 400);
						done();
					} else {
						done(new Error("Did not return an error."));
					}
				});
				
			})
		})
	})
	//________
	context("The required role array has a value of: \"[\"admin\", \"dev\"].\"", function() {
		context("The \"locationOfRoles\" JSON key has a value of: \"user.perm.role\"", function() {
			it('should return no error because the module uses OR logic', function(done) {
				ssarv(["admin", "mod"], {locationOfRoles: "user.perm.role"})(req, res, function(err) {
					if(err) {
						done(err);
					} else {
						done();
					}
				});
				
			})
		})
	})

	//______
	context("The required role array has a value of: \"[\"mod\", \"admin\"].\"", function() {
		context("The \"locationOfRoles\" JSON key has a value of: \"user.perm.role\"", function() {
			it('should return no error because the module uses OR logic', function(done) {
				ssarv(["mod", "admin"], {locationOfRoles: "user.perm.role"})(req, res, function(err) {
					if(err) {
						done(err);
					} else {
						done();
					}
				});
				
			})
		})
	})

	//________

	context("The required role array has a value of: \"[\"fail\", \"group\"].\"", function() {
		context("The \"locationOfRoles\" JSON key has a value of: \"user.perm.role\"", function() {
			it('should return 403 \"Forbidden\", because user does not have these roles', function(done) {
				ssarv(["fail", "group"], {locationOfRoles: "user.perm.role"})(req, res, function(err) {
					if(err) {
						assert.equal(err.status, 403);
						done();
					} else {
						done(new Error("Did not return an error."));
					}
				});
				
			})
		})
	})
});


