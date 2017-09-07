/**
 * @type directive
 * @name ovhDirectives:flextable
 * @description
 * TODO
 */
angular.module('ua.flexTable').controller('flexTableCtrl',
['$scope', '$element', '$attrs',
function ($scope, $element, $attrs) {
    "use strict";
    var sortable    = $attrs.sortable,
    selectable  = $attrs.selectable,
    multiselect = $attrs.multiselect,
    included    = $attrs.included,
    scope       = $scope;

    if (included && included === 'true') {
        scope = $scope.$parent;
    }

    scope.responsive = !!$attrs.responsive;

    if (sortable && sortable === 'true') {
        scope.table = {
            order : {},
            sortIcon : function (sortOn) {
                return ' icon-chevron-' + this.order[sortOn];
            },
            sort : function (tableValue, sortOn) {
                var currentSort = this.order[sortOn], sortDirection = 'up', pathArray = sortOn.split('.');

                if (currentSort === 'up') {
                    sortDirection = 'down';
                }
                this.order = {};
                this.order[sortOn] = sortDirection;

                function getValue(object, pathArray) {
                    var currentObject = object,
                    i;
                    for (i = 0; i < pathArray.length; i++) {
                        currentObject = currentObject[pathArray[i]];
                    }

                    return currentObject;
                }

                function sort(a, b) {
                    var valueA = getValue(a, pathArray), valueB = getValue(b, pathArray);

                    if (valueA === valueB) {
                        return 0;
                    }

                    if (valueA === null || typeof valueA === 'undefined') {
                        valueA = '';
                    }

                    if (valueB === null || typeof valueB === 'undefined') {
                        valueB = '';
                    }

                    if (typeof valueA === 'number' && typeof valueB === 'number') {
                        return valueA < valueB ? -1 : 1;
                    }

                    return String(valueA).trim().localeCompare(String(valueB).trim());
                }

                function reverse(a, b) {
                    return sort(a, b) * -1;
                }

                if (sortDirection === 'down') {
                    tableValue.sort(reverse);
                } else {
                    tableValue.sort(sort);
                }

            }
        };
    }

    if (selectable && selectable === 'true') {

        scope.tableId = scope.$id;
        scope.selectionMap = {};

        scope.isMultiSelect = function () {
            return multiselect === 'true';
        };

        scope.addSelection = function (id, obj) {
            if (!scope.isMultiSelect())
            {
                scope.selectionMap = {};
            }

            if (!scope.selectionMap[id])
            {
                scope.selectionMap[id] = obj;
            }

            if (!scope.$$phase) {
                scope.$apply();
            }
        };

        scope.removeSelection = function (id) {
            if (scope.selectionMap[id])
            {
                delete scope.selectionMap[id];
            }
            if (!scope.$$phase) {
                scope.$apply();
            }
        };

        scope.setAllChecked = function (bool) {

            $.each($element.find('div.table-div-striped > div > div:first-child > input'), function (index, input) {
                if ((bool && !$(input).is(':checked')) || (!bool && $(input).is(':checked'))) {
                    $(input).click();
                }
            });
        };

        scope.hasSelection = function () {
            return $.count(scope.selectionMap) > 0;
        };

        scope.getSelection = function () {
            return $.values(scope.selectionMap);
        };

        scope.getFirstSelection = function () {
            return scope.getSelection()[0];
        };
    }
}]);
