'use strict';

module.exports = function (router) {
    router.use(function (req, res, next) {
        //Check header or url for token.
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            //Verify the token with the superSecret.
            jwt.verify(token, app.get("superSecret"),
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
    });
};