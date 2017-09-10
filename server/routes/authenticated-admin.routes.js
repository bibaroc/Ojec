module.exports = (function () {
    'use strict';
    var adminRouter = require("express").Router();
    adminRouter.use(require("../middlewares/authenticated-admin.middleware"));
    adminRouter.get("/", (req, res) => {
        res.send(
            {
                "success": true,
                "msg": "You logged in as an admin."
            });
    });
    return adminRouter;
})();