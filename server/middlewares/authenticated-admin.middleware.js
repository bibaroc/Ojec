var config = require("../modules/config");

module.exports = function (req, res, next) {
    'use strict';
    //At this point the user must have been validated and logged in.
    if (req.decoded) {
        //Verify the token with the superSecret.
        if (req.decoded.admin) {
            next()
        }
        else {
            return res.status(401).send(
                {
                    "success": false,
                    "msg": "You are not a certified seller."
                });
        }
    }
    //Token wasn't decoded.
    else {
        return res.status(401).send(
            {
                "success": false,
                "msg": "Please sign in as a certified seller."
            });
    }
};