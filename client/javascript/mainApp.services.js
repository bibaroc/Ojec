var app = angular.module('mainApp')
    .service('itemsWatchingSrv', function () {
        'use strict';
        var itemsWatching = [];

        var addProduct = function (newObj) {
            itemsWatching.push(newObj);
        };
        var getProducts = function () {
            return itemsWatching;
        };
        var remove = function (item) {
            return itemsWatching.indexOf(item) > -1 ? itemsWatching.splice(itemsWatching.indexOf(item), 1) : -1;
        };

        return {
            addProduct: addProduct,
            getProducts: getProducts,
            remove: remove
        };
    })
    .service('itemsSellingSrv', function () {
        'use strict';
        var itemsSelling = [];

        var addProduct = function (newObj) {
            itemsSelling.push(newObj);
        };
        var getProducts = function () {
            return itemsSelling;
        };
        var remove = function (item) {
            return itemsSelling.indexOf(item) > -1 ? itemsSelling.splice(itemsSelling.indexOf(item), 1) : -1;
        };

        return {
            addProduct: addProduct,
            getProducts: getProducts,
            remove: remove
        };
    })
    .service('pastSrv', function () {
        'use strict';
        var history = [];
        var addProduct = function (newObj) {
            history.push(newObj);
        };
        var getProducts = function () {
            return history;
        };

        return {
            addProduct: addProduct,
            getProducts: getProducts,
        };
    })
    .service('cartSrv', function () {
        'use strict';
        var cart = [];

        var addProduct = function (newObj, qnt) {
            cart.push({ item: newObj, qntt: qnt });
        };
        var getProducts = function () {
            return cart;
        };
        var remove = function (item) {
            angular.forEach(cart, function (element) {
                //Fuck me right?
                if (element.item._id == item._id) {
                    return cart.splice(cart.indexOf(element), 1);
                }
            });
            return -1;
        };

        var reset = function () {
            cart = [];
        };

        return {
            addProduct: addProduct,
            getProducts: getProducts,
            remove: remove,
            reset: reset
        };
    });