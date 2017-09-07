'use strict';

module.exports = function (authenticatedUserRouter) {
    authenticatedUser.get("/users", function (req, res) {
        User.find({}, function (err, users) {
            res.send(users);
        });
    });
};