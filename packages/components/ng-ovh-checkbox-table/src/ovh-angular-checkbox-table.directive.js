/**
 * @decription
 * The directive tracks the array of selected element and update automatically its state.
 *
 * State:
 *   - 0 : Nothing selected
 *   - 1 : Partial elements selected
 *   - 2 : All elements selected
 *
 * @version 1.0.1
 *
 * @changelog
 * # Version 1.0.0
 *   Initial version
 * [1.0.1]
 *   Fix arrays length and initialization
 *
 * @example
 * <code:html>
 *
 *     <input type="checkbox"
 *            data-tri-state-checkbox="id"        <!-- (ID is optional) -->
 *            data-tsc-ids-all="arrayFull"        <!-- Array with all IDs -->
 *            data-tsc-ids-selected="arraySel"    <!-- Array with IDs selected -->
 *            data-tsc-on-click="foo(newState)"   <!-- Parent scope function called when user click on the checkbox -->
 *     />
 *
 * </code>
 *
 * @info
 * The checkbox update its state AUTOMATICALLY when the array of selected IDs is updated.
 * If the user click on the checkbox, it call a function with the new state in param.
 * With this, you can update your array/view!
 */
angular.module("ovh-angular-checkbox-table").directive("ovhCheckboxTable", function ($timeout) {
    "use strict";
    return {
        restrict: "A",
        scope: {
            idsAll: "=ovhCheckboxTableIdsAll",
            idsPage: "=ovhCheckboxTableIdsPage",
            idsSelected: "=ovhCheckboxTableIdsSelected",
            id: "@ovhCheckboxTableId"
        },
        link: function ($scope, el) {
            $scope.$watch("idsAll", function () {
                if (!angular.isUndefined($scope.idsAll) && angular.isArray($scope.idsAll)) {
                    $scope.idsSelected = {};
                    autoUpdateState();
                }
            });

            $scope.$watch("idsSelected", function () {
                // remove all ids with checked=false
                $scope.idsSelected = _.omit($scope.idsSelected, function (isChecked) {
                    return !isChecked;
                });
                autoUpdateState();
            }, true);

            $scope.state = 0;

            function autoUpdateState () {
                if ($scope.idsAll && $scope.idsAll.length && $scope.idsAll.length === Object.keys($scope.idsSelected).length) {
                    setStateTo(2); // All selected
                } else if ($scope.idsAll && $scope.idsAll.length && Object.keys($scope.idsSelected).length > 0) {
                    setStateTo(1);
                } else {
                    setStateTo(0);
                }
            }

            function setStateTo (nbr) {
                $scope.state = nbr;
                $timeout(function () {
                    el.prop({
                        checked: nbr === 2,
                        indeterminate: nbr === 1
                    });
                });
            }

            // @todo test touch
            el.bind("click touchend", function (e) {
                e.preventDefault();
                if ($scope.state === 2) {
                    setStateTo(0);
                    $scope.idsSelected = {};
                } else {
                    var pageAlreadyAdd = true;

                    // test if this page is already checked
                    angular.forEach($scope.idsPage, function (value) {
                        pageAlreadyAdd = pageAlreadyAdd && (angular.isDefined($scope.id) ? $scope.idsSelected[value[$scope.id]] : $scope.idsSelected[value]) === true;
                    });
                    if (pageAlreadyAdd) {
                        getIdsSelectedOf($scope.idsAll);
                    } else {
                        getIdsSelectedOf($scope.idsPage);
                    }
                    autoUpdateState();
                }
            });

            function getIdsSelectedOf (ids) {
                angular.forEach(ids, function (value) {
                    $scope.idsSelected[angular.isDefined($scope.id) ? value[$scope.id] : value] = true;
                });
            }

        }
    };
});
