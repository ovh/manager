angular.module('ua.productList').directive('productList', function () {
    'use strict';
    return {
        restrict    : 'A',
        scope       : true,
        templateUrl : 'components/ovh-utils-angular/productList/productList.html',
        transclude  : true
    };
});
