/**
 * @ngdoc directive
 * @name ovhDirectives.directive:triStateCheckbox
 * @element ANY
 *
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
angular.module('ua.triStateCheckbox').directive('triStateCheckbox', ['$timeout', function ($timeout) {
    'use strict';
    return {
        restrict : 'A',
        scope    : {
            idsAll      : '=tscIdsAll',
            idsSelected : '=tscIdsSelected',
            onClick     : '&tscOnClick'
        },
        link     : function ($scope, el) {
            var initialized = false;

            $scope.state = 0;

            function init() {
                $scope.$watch('idsAll.length', function() {
                    autoUpdateState();
                });
                $scope.$watch('idsSelected.length', function() {
                    autoUpdateState();
                });
                initialized = true;
            }

            function autoUpdateState() {
                if ($scope.idsAll.length && $scope.idsAll.length === $scope.idsSelected.length) {
                    setStateTo(2);
                } else if ($scope.idsAll.length && $scope.idsSelected.length > 0) {
                    setStateTo(1);
                } else {
                    setStateTo(0);
                }
            }

            function setStateTo(nbr) {
                if (!initialized) {
                    return;
                }
                $scope.state = nbr;
                $timeout(function() {
                    el.prop({
                        'checked'       : (nbr === 2 ? true : false),
                        'indeterminate' : (nbr === 1 ? true : false)
                    });
                });
            }

            $scope.$watch('idsAll', function() {
                if (!initialized && angular.isArray($scope.idsAll) && $scope.idsAll.length) {
                    init();
                }
            });

            // @todo test touch
            el.bind('click touchend', function(e) {
                e.preventDefault();
                if ($scope.state === 2) {
                    setStateTo(0);
                } else {
                    setStateTo($scope.state + 1);
                }
                $scope.onClick({ state: $scope.state });
            });

        }
    };
}]);
