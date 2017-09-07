/**
 * @type directive
 * @name ovhDirectives:grid
 * @version 1.0.0
 * @description
 * Provide a very lightweight scrollable table
 * @param {string} data the variable name
 * @param {string} selectable 'multi' or 'single'
 * @param {boolean} sortable
 * @param {string} identifierField the field for select a row
 * @param {Object} css a style description
 *@example
 * <code:html>
 * <div data-ng-controller="MyCtrl">
 *  <!-- some stuff -->
 *   <!-- ... -->
 *  <div grid="gridOptions" />
 * </div>
 * </code>
 * <code:js>
 * var MyCtrl = function (scope) {
 *
 *     scope.data = [];
 *
 *     scope.itemSelections : [];
 *
 *     scope.$watch('itemSelections', function (newValue) {
 *          //do stuff on change selection
 *     });
 *
 *     scope.gridOptions : {
 *          data: 'data',
 *          sortable: true,
 *          selectable: 'multi',
 *          identifierField: 'id',
 *          selectedItem: 'itemSelections',
 *          columns: [{
 *              field: 'date',
 *              displayName: 'Date'
 *          }, {
 *              field: 'sender'
 *              displayName: 'Emetteur'
 *          }]
 *     };
 *
 *     $http.get('url', function (result) {
 *          scope.data = result.results;
 *     });
 * };
 * MyCtrl.$inject = [$scope];
*  </code>
 **/
angular.module('ua.grid').directive('grid', function () {
    'use strict';
    // directive description
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope: true,

        templateUrl: 'components/ovh-utils-angular/grid/grid.html',
        link: function (scope, elt, attrs) {
            var options = scope.options = scope.$parent.$eval(attrs.grid),
                i = -1, nbColumns = -1,
                register = function (idx) {
                    scope.$watch(scope.columns[i].displayName, function (newValue) {
                        if (newValue !== undefined) {
                            scope.columns[idx].displayName = newValue;
                        }
                    });
                };

            if (!options) {
                options = scope.options = {
                    rows : {},
                    columns : []
                };
            }
            scope.rows = scope.$parent.$eval(options.data);

            scope.columns = options.columns;
            i = nbColumns = scope.columns.length;

            scope.selectedItem = {};
            scope.allChecked = {
                allChecked: false
            };
            scope.predicateSortOrder = '';
            scope.orderReverseSort = false;
            scope.search = scope.$parent.$eval(options.search);

            //Just define some default class and style
            if (!scope.options.css) {
                scope.options.css = {};
            }
            scope.options.css = angular.extend({
                header : {
                    'class': 'row-fluid'
                },
                row: {
                    'class': 'row-fluid'
                },
                body: {
                    style: {
                        'overflow': 'auto',
                        'max-height': '168px'
                    }
                },
                container: {
                    style: {
                        'padding': '2px 0px 0px 2px'
                    }
                }
            }, scope.options.css);

            for (i ; i-- ;) {
                if (!scope.columns[i].css) {
                    scope.columns[i].css = {};
                }
                scope.columns[i].css = angular.extend({
                    'class': 'span' + (12  / (nbColumns % 12))
                }, scope.columns[i].css);

                register(i);
            }

            scope.$watch(options.data, function (newValue) {
                scope.rows = newValue;
            });

            // If search watch after change
            if (options.search !== null && options.search !== undefined && options.search !== '') {
                scope.$watch(options.search, function (newValue) {
                    scope.search = newValue;
                }, true);
            }

            // when change selectedItem change parent item
            if (scope.options.selectable !== null &&
                    scope.options.selectable !== undefined &&
                    (scope.options.selectable === 'multi' ||
                     scope.options.selectable === 'single')) {

                scope.$watch('selectedItem', function (newValue) {
                    if (scope.options.selectable === 'multi') {
                        scope.$emit('gridSelectionChange', $.grep(scope.rows, function (item) {
                                if (newValue.hasOwnProperty(item[scope.options.identifierField])) {
                                    return newValue[item[scope.options.identifierField]];
                                } else {
                                    return false;
                                }
                            })
                        );
                    } else {
                        scope.$emit('gridSelectionChange', $.grep(scope.rows, function (item) {
                                return item[scope.options.identifierField] === newValue.items;
                            })
                        );
                    }
                }, true);// end watch

                //to select or unselecte al element
                scope.toggleSelectAll = function () {
                    var tmpSelection = {};
                    if (scope.allChecked.allChecked) {
                        angular.forEach(scope.rows, function (item) {
                            tmpSelection[item[scope.options.identifierField]] = true;
                        });
                    }
                    scope.selectedItem = tmpSelection;
                };// end toggleSelecteAll
            } else if (scope.options.selectable !== null && scope.options.selectable !== undefined && (scope.options.selectable !== 'multi' || scope.options.selectable !== 'single')) {
                throw "[ovhdirectives.grid] - Unknown value for selectable options, it must be 'single' or 'multi'";
            }// end if
            //to sort
            scope.sort = function (field) {
                scope.orderReverseSort = !scope.orderReverseSort;
                scope.predicateSortOrder = field;
            };//end sort
        }// endlink  function
    };//end return directive
});//end directive
