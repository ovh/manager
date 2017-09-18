angular.module("ovh-angular-pagination-front", ["ui.bootstrap"]);

/**
 * @ngdoc directive
 * @name ovh-angular-pagination-front.directive:pagination-front
 * @restrict A
 *
 * @description
 * <p>Pagination module for managers. parameters are saved in local storage</p>
 * @example
   <example module="MyModule">
   <file name="index.html">
        <div ng-controller="mainCtrl">
            <ul>
                <li data-ng-repeat="item in toDisplay track by $index" data-ng-bind="item"></li>
            </ul>
            <div pagination-front data-items="items" paginated-items="toDisplay">
            </div>
        </div>
   </file>
   <file name="script.js">
        angular.module("MyModule", ["ovh-angular-pagination-front"]);
        angular.module("MyModule").controller("mainCtrl", function($scope) {
            $scope.item = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q" ];
        });
   </file>
   </example>
 * @param     {Array} items                     List of items to paginate
 * @param     {Array} paginatedItems            List of items on the currentpage (those to be displayed)
 * @param   {Number=} [currentPage=1]           Current page number
 * @param   {Number=} nbPages                   Number of pages
 * @param   {Number=} [itemsPerPage=10]         Number of items per page
 * @param      {Any=} refresh                   The component is refreshed when this variable change
 * @param   {String=} pagePlaceholder           Text to display in the page input
 * @param   {String=} itemPerPagePlaceholder    Text to display in the item per page input
 * @param {Function=} onPageChange              Function to execute on change
 * @param {Function=} transformItem             Function executed on each item on pagination
 * @param {Function=} onTransformItemGetPromise Function that get the transformItem promise (ie. on-transform-item-get-promise="foo(promise)")
 * @param {Function=} onTransformItemDone       Function invoked when transformItem is done on all items
 * @param {Function=} onTransformItemNotify     Function invoked when transformItem is done on each item
 * @param {Number=} goToPage                    Page to reach
 * @param {String=} saveName                    Name of number value items per page will be saved into localstorage  (Optional)
 */
angular.module("ovh-angular-pagination-front").directive("paginationFront", ["$q", function ($q) {
    "use strict";

    return {
        restrict: "A",
        templateUrl: "ovh-angular-pagination-front.html",
        replace: false,
        transclude: true,
        scope: {
            items: "=",
            fakeCurrentPage: "=?currentPage",
            numPages: "=?nbPages",
            itemsPerPage: "=?",
            refresh: "=?",
            paginatedItems: "=",
            pagePlaceholder: "@",
            itemPerPagePlaceholder: "@",
            onPageChange: "&",
            transformItem: "&?",
            onTransformItemGetPromise: "&",
            onTransformItemDone: "&",
            onTransformItemNotify: "&",
            goToPage: "@",
            saveName: "@?"
        },
        link: function ($scope) {
            var saveName = typeof $scope.saveName === "string" && $scope.saveName.length ? "pagination_front_items_per_page_" + $scope.saveName : "pagination_front_items_per_page";

            if ($scope.fakeCurrentPage) {
                $scope.currentPage = $scope.fakeCurrentPage;

                $scope.$watch("fakeCurrentPage", function (page) {
                    if (page && page <= $scope.numPages) {
                        $scope.currentPage = page;
                    }
                });
            } else {
                $scope.currentPage = 1;
            }

            if (localStorage && localStorage.getItem(saveName)) {
                $scope.itemsPerPage = parseInt(localStorage.getItem(saveName), 10) || 10;
            } else if (!$scope.itemsPerPage) {
                $scope.itemsPerPage = 10;
            }

            $scope.maxSize = 5;

            var doTransform = function (items) {
                var rejectedItem = {};
                var promise = $q.all(items.map(function (item) {
                    return $q.when($scope.transformItem({
                        item: item
                    })).then(function (transformed) {
                        $scope.onTransformItemNotify({ item: transformed });
                        return transformed;
                    }).catch(function () {
                        return rejectedItem;
                    });
                })).then(function (itemList) {
                    var filtredItems = itemList.filter(function (item) {
                        return item !== rejectedItem;
                    });
                    $scope.onTransformItemDone({ items: filtredItems });
                    return filtredItems;
                });
                $scope.onTransformItemGetPromise({ promise: promise });
                return promise;
            };

            var paginates = function () {

                if ($scope.arrayItems) {
                    $scope.paginatedItems = [];

                    var from = ($scope.currentPage - 1) * $scope.itemsPerPage;
                    var to = $scope.itemsPerPage * $scope.currentPage;
                    var itemsToLoad = [];

                    if (to > $scope.totalItems) {
                        to = $scope.totalItems;
                    }

                    if (from < 0) {
                        from = 0;
                    }

                    for (var i = from; i < to; i++) {
                        itemsToLoad.push(angular.copy($scope.arrayItems[i]));
                    }

                    if ($scope.transformItem) {
                        doTransform(itemsToLoad).then(function (transformatedItems) {
                            $scope.paginatedItems = transformatedItems;
                        });
                    } else {
                        $scope.paginatedItems = itemsToLoad;
                    }

                    $scope.onPageChange({ items: $scope.paginatedItems });
                }
            };

            var isInt = function (value) {
                return !isNaN(value) &&
                    parseInt(Number(value), 10) === value &&
                    !isNaN(parseInt(value, 10));
            };

            $scope.$watch("items", function (nv) {
                if (nv !== undefined) {
                    if (angular.isObject(nv) && !angular.isArray(nv)) {
                        $scope.arrayItems = _.toArray($scope.items);
                    } else {
                        $scope.arrayItems = $scope.items;
                    }
                    $scope.arrayItems = $scope.arrayItems || [];
                    $scope.totalItems = $scope.arrayItems.length;
                    paginates();
                }
            }, true);

            // Watch change page
            $scope.$watch("currentPage", function (page) {
                if (isInt(page)) {
                    paginates();
                    $scope.fakeCurrentPage = page;
                }
            });

            $scope.changePage = function () {
                if (parseInt($scope.goPage, 10)) {
                    if ($scope.goPage) {
                        if ($scope.goPage > $scope.numPages) {
                            $scope.currentPage = $scope.numPages;
                        } else {
                            $scope.currentPage = $scope.goPage;
                        }
                    } else {
                        $scope.currentPage = 1;
                    }
                }
            };

            $scope.changePageKeyPress = function ($event) {
                if ($event.keyCode === 13) {
                    $scope.goPage = null;
                }
            };

            // Watch number of items per page
            $scope.$watch("itemsPerPage", function (itemsPerPage) {
                if (itemsPerPage !== undefined) {
                    if (localStorage) {
                        localStorage.setItem(saveName, itemsPerPage);
                    }
                    paginates();
                }
            });

            $scope.$watch("refresh", function () {
                paginates();
            });

        }

    };

}]);

angular.module('ovh-angular-pagination-front').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('ovh-angular-pagination-front.html',
    "<div class=pagination-container><ul data-uib-pagination data-total-items=totalItems data-max-size=maxSize data-boundary-links=true data-rotate=false data-num-pages=numPages data-items-per-page=itemsPerPage data-ng-model=currentPage data-previous-text=&lsaquo; data-next-text=&rsaquo; data-first-text=&laquo; data-last-text=&raquo;></ul><div class=\"form-inline pull-right\"><select class=form-control name=itemsPerPageSelect data-ng-show=\"goToPage !== 'false'\" data-ng-model=itemsPerPage data-ng-options=\"size for size in [5, 10, 20, 40, 80, 100]\"><option value=\"\" selected disabled data-ng-bind=itemPerPagePlaceholder selected></option></select><input class=form-control name=currentPageInput type=number min=1 placeholder={{pagePlaceholder}} data-ng-show=\"goToPage !== 'false'\" data-ng-model=goPage data-ng-model-options=\"{ debounce: {'default': 500} }\" data-ng-change=changePage() data-ng-blur=\"goPage = null\" data-ng-keypress=changePageKeyPress($event);></div></div>"
  );

}]);
