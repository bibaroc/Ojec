'use strict'
var app = angular.module('mainApp')
    .service('itemsWatchingSrv', function () {
        var itemsWatching = [];

        var addProduct = function (newObj) {
            itemsWatching.push(newObj);
        };
        var getProducts = function () {
            return itemsWatching;
        };
        var remove = function (item) {
            return itemsWatching.indexOf(item) > -1 ? itemsWatching.splice(itemsWatching.indexOf(item), 1) : -1;
        }

        return {
            addProduct: addProduct,
            getProducts: getProducts,
            remove: remove
        };
    })
    .service('itemsSellingSrv', function () {
        var itemsSelling = [];

        var addProduct = function (newObj) {
            itemsSelling.push(newObj);
        };
        var getProducts = function () {
            return itemsSelling;
        };
        var remove = function (item) {
            return itemsSelling.indexOf(item) > -1 ? itemsSelling.splice(itemsSelling.indexOf(item), 1) : -1;
        }

        return {
            addProduct: addProduct,
            getProducts: getProducts,
            remove: remove
        };
    });