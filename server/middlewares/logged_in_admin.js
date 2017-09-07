'use strict';

module.exports = function (router) {
    router.use(function (req, res, next) {
        if (!req.decoded) {
            return res.send(
                {
                    "success": false,
                    "msg": "LogIn please."
                });
        } else {
            if (req.decoded.admin) {
                next();
            }
            else {
                return res.send(
                    {
                        "success": false,
                        "msg": "Apparently you are not an administrator, if you'r experiencing problems logging in contact us."
                    });
            }

        };
    });
};