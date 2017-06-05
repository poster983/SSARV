var ssarv = require('../index.js');
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