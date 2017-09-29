module.exports = (function () {
    'use strict';
    var userRouter = require("express").Router();
    userRouter.use(require("../middlewares/authenticated-user.middleware"));
    userRouter.get("/", (req, res) => {
        res.send(
            {
                "success": true,
                "msg": "You logged in as a user."
            });
    });
    userRouter.get("/userInfo", (req, res) => {
        var user = req.decoded;
        res.send(
            {
                "name": user.name,
                "lastName": user.lastName
            });
    });
    return userRouter;
})();