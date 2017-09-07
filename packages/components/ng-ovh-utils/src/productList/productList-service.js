angular.module('ua.productList').service('ProductList', ['$rootScope', '$q', function ($rootScope, $q) {
    "use strict";

    var products,
        selected = null,
        productsMap = {},
        deferredSelected = $q.defer();

    this.setList = function (product) {
        products = product;
        $rootScope.$broadcast('ProductList.set', products);
    };

    function  findProduct(product) {
        var type,
            p, i;

        if (angular.isString(product) && productsMap[product] !== undefined) {
            return productsMap[product];
        } else if (angular.isString(product)) {
            for(type in products) {
                if (products.hasOwnProperty(type)) {

                    p = products[type];
                    i = p.length;

                    for(i;i--;) {
                        if (p[i].name === product) {
                            productsMap[p[i].name] = p[i];
                            return p[i];
                        }
                    }
                }
            }
        }
        return product;
    }

    this.select = function (product, preventDefault) {
        var newSelected = findProduct(product),
            unregister;

        function resolver(s) {
            selected = s;
            deferredSelected.resolve(selected);
            if (!preventDefault) {
                $rootScope.$broadcast('ProductList.select', selected);
            }
        }

        deferredSelected = $q.defer();

        if (newSelected !== null) {
            resolver(findProduct(product));
        } else {
            unregister = $rootScope.$on('ProductList.set', function () {
                selected = findProduct(product);
                if (selected !== null) {
                    resolver(selected);
                    unregister();
                }
            });
        }
    };

    this.getSelected = function () {
        return deferredSelected.promise;
    };

    this.unSelect = function () {
        deferredSelected = $q.defer();
        selected = null;
        $rootScope.$broadcast('ProductList.unSelect');
    };

    this.clean = function () {
        deferredSelected = $q.defer();
        selected = null;
        products = null;
        $rootScope.$broadcast('ProductList.clean');
    };
}]);
