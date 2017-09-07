module.exports = (function () {
    'use strict';
    var userRouter = require("express").Router();
    userRouter.use(require("../middlewares/authenticated_user"));
    userRouter.get("/", (req, res) => {
        res.send(
            {
                "success": true,
                "msg": "You logged in as a user."
            });
    });
    return userRouter;
})();