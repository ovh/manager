angular.module('ua.productList').directive('productListEntry',
['ProductList',
function (ProductList) {
    'use strict';
    return {
        restrict    : 'A',
        tranclude   : false,
        scope       : {
            'productListTitle' : '@',
            'productListEntry' : '='
        },
        templateUrl : 'components/ovh-utils-angular/productList/productListEntry/productListEntry.html',
        link        : function ($scope) {
            $scope.selected = null;

            $scope.$watch('productListEntry', function (nv) {
                if (nv !== undefined) {
                    ProductList.getSelected().then(function (selected) {
                        $scope.selected = selected;
                    });
                }
            });

            $scope.$on('ProductList.select', function (evt, product) {
                $scope.selected = product;
            });

            $scope.$on('ProductList.unSelect', function () {
                delete $scope.selected;
            });

            $scope.$on('ProductList.clean', function () {
                delete $scope.selected;
            });

            $scope.selectProduct = function (product) {
                ProductList.select(product);
            };
        }
    };
}]);
