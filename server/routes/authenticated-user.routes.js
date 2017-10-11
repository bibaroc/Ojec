var User = require("../modules/user");

module.exports = (function () {
    'use strict';
    var userRouter = require("express").Router();
    //userRouter.use(require("../middlewares/authenticated-user.middleware"));
    userRouter.get("/", (req, res) => {
        res.send(
            {
                'success': true,
                'msg': 'You logged in as a user.'
            });
    });
    userRouter.get("/userInfo", (req, res) => {
        User.findOne(
            {
                "email": req.decoded.email
            },
            function (err, user) {
                if (err) {
                    res.status(500).send(
                        {
                            "success": false,
                            "msg": "There was an error while looking up the user."
                        });
                }
                else if (!user) {
                    res.status(406).send(
                        {
                            "success": false,
                            "msg": "User not found. Are you fucking up the server?"
                        });
                }
                else {
                    res.status(200).send(
                        {
                            "success": true,
                            "user": {
                                "name": user.name,
                                "lastName": user.lastName,
                                "email": user.email,
                                "itemsWatching": user.itemsWatching,
                                "itemsSelling": user.itemsSelling,
                                "admin": user.admin
                            }
                        });
                }
            });
    });
    return userRouter;
})();