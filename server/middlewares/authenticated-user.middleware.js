var config = require("../modules/config");
var jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    'use strict';
    //Check header or url for token.
    var token = req.token;
    if (token) {
        //Verify the token with the superSecret.
        jwt.verify(token, config.secret,
            function (err, decoded) {
                if (err) {
                    res.status(401).send(
                        {
                            "success": false,
                            "msg": "Seems you have altered the token."
                        });
                }
                //It's allright here.
                else {
                    //I save the decoded token in the request for further use.
                    req.decoded = {
                        "admin": decoded.admin,
                        "email": decoded.email
                    };
                    //Next does exit from the middleware.
                    next();
                }
            });
    }
    //Token wasn't provided.
    else {
        console.log("someone tried to log in");
        return res.status(401).send(
            {
                "success": false,
                "msg": "LogIn please. Token not provided"
            });
    }
};