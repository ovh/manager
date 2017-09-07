angular.module('ua.typeOff').controller('typeOffCtrl',
['$scope', '$parse', '$attrs', '$filter',
function ($scope, $parse, attrs, $filter) {
    "use strict";

    var savedItems;

    $scope.hide = false;

    this.activate = function(item) {
        $scope.active = item;
    };

    this.activateNextItem = function() {
        var index = $scope.items.indexOf($scope.active);
        this.activate($scope.items[(index + 1) % $scope.items.length]);
    };

    this.activatePreviousItem = function() {
        var index = $scope.items.indexOf($scope.active);
        this.activate($scope.items[index === 0 ? $scope.items.length - 1 : index - 1]);
    };

    this.isActive = function(item) {
        return $scope.active === item;
    };

    this.selectActive = function() {
        this.select($scope.active);
    };

    /*
     * Select item in list
     */
    this.select = function(item) {

        $scope.hide = true;
        $scope.focused = true;

        if (attrs.typeOffTermPath && angular.isString($scope.termpath)) {
            $scope.term = $parse($scope.termpath)(item);
        } else {
            if (attrs.typeOffSelect) {
                $scope.select({
                    item:item
                });
            } else {
                $scope.term = item;
            }
        }
    };

    this.hide = function () {
        $scope.hide = true;
        $scope.focused = true;
    };

    $scope.isVisible = function() {
        if ($scope.showWhenEmpty === true || $scope.showWhenEmpty === "true") {
            return !$scope.hide && ($scope.focused || $scope.mousedOver);
        } else {
            return !$scope.hide && ($scope.focused || $scope.mousedOver) && (angular.isString($scope.term) && $scope.term !== '');
        }
    };

    this.query = $scope.query = function () {
        $scope.hide = false;

        if (!attrs.typeOffTerm) {
            throw "[ovh-utils-angular.ovhDirects.typeOff.query] missing 'type-off-term attribute'";
        }

        if (attrs.typeOffSearch) {
            $scope.search({
                term    :   $scope.term
            });
        } else {
            if (angular.isUndefined(savedItems) && $scope.items && $scope.items.length > 0) {
                savedItems = angular.copy($scope.items);
            }

            if ($scope.term) {
                $scope.items = $filter('filter')(savedItems || [], $scope.term);
            } else {
                $scope.items = savedItems;
            }
        }
    };
}]);
