var config = require("../modules/config");
var jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    'use strict';
    //Check header or url for token.
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        //Verify the token with the superSecret.
        jwt.verify(token, config.secret,
            function (err, decoded) {
                if (err) {
                    res.send(
                        {
                            "success": false,
                            "msg": "Invalid token."
                        });
                }
                //It's allright here.
                else {
                    //I save the decoded token in the request for further use.
                    req.decoded = decoded;
                    //Next does exit from the middleware.
                    next();
                }
            });
    }
    //Token wasn't provided.
    else {
        return res.send(
            {
                "success": false,
                "msg": "LogIn please."
            });
    }
};