/**
 * @ngdoc directive
 * @name ovhDirectives.directives:dateTimePicker
 * @element ANY
 * @requires
 *
 * @description
 * provide autocompletion
 *
 * @example
 * <code:html>
 *
 *
 *  <div data-ng-controller="TestSimple">
 *       <div data-type-off
 *            class="type-off"
 *            data-type-off-items="items"           <!-- list of item to search -->
 *            data-type-off-term="term"             <!-- the input model -->
 *            data-type-off-term-path="'name'">     <!-- the path to search term into item-->
 *
 *             <!-- this part is a template you can make what you want -->
 *             <div class="type-off-suggestions">
 *                <h3 data-ng-show="hasItems()">Items</h3>
 *                <ul>
 *                    <li data-type-off-item="item"     <!-- to bind event for selection -->
 *                        data-ng-repeat="item in items"
 *                        class="type-off-item">
 *                        <p>{{item.name}}</p>
 *                        <p>{{item.data}}</p>
 *                    </li>
 *                </ul>
 *            </div>
 *
 *         </div>
 *     </div>
 *
 *     <div data-ng-controller="TestComplete">
 *
 *        <div data-type-off
 *             class="type-off"
 *             data-type-off-items="items"
 *             data-type-off-term="term"
 *             data-type-off-search="searchItem(term)"    <!--- you can create your own search function-->
 *             data-type-off-select="selectItem(item)">   <!-- you can create your own selection function-->
 *
 *            <!-- you can create sub categorie for instance -->
 *            <div class="type-off-suggestions">
 *
 *                <h3 data-ng-show="hasItemsA()">A</h3>
 *                <ul>
 *                    <li data-type-off-item="itemA"
 *                        data-ng-repeat="itemA in fitemsA" class="type-off-item">
 *                        <p>{{itemA.name}}</p>
 *                        <p>{{itemA.data}}</p>
 *                    </li>
 *                </ul>
 *
 *                <h3 data-ng-show="hasItemsB()">B</h3>
 *                <ul>
 *                    <li data-type-off-item="itemB"
 *                        data-ng-repeat="itemB in fitemsB" class="type-off-item">
 *                        <p>{{itemB.name}}</p>
 *                    </li>
 *                </ul>
 *
 *            </div>
 *        </div>
 *    </div>
 *    <script type="text/javascript">
 *            angular.module('test', ['ovh-utils-angular']).controller('TestSimple', ['$scope', '$filter', function($scope, $filter) {
 *
 *                $scope.items  = [];
 *                $scope.term = null;
 *
 *                // juste get item
 *                for (var i = 0 ; i < 10 ; i++) {
 *                    $scope.items.push({
 *                        id   : 'A-' + i,
 *                        name : 'items a ' + i,
 *                        data : 'aaaaaaaaaa' + i + 'aaaaaaaa'
 *                    });
 *                    $scope.items.push({
 *                        id   : 'B-' + i,
 *                        name : 'items b ' + i,
 *                        data : 'bbbbbbbbbb' + i + 'bbbbbbbbb'
 *                    });
 *                }
 *
 *                $scope.hasItems = function() {
 *                    return $scope.items.length > 0;
 *                };
 *
 *            }]).controller('TestComplete', ['$scope', '$filter', function($scope, $filter) {
 *
 *                    $scope.items  = [];
 *                    $scope.term = null;
 *
 *                    var itemsA = [],
 *                        itemsB = [];
 *
 *                    for (var i = 0 ; i < 10 ; i++) {
 *                        itemsA.push({
 *                            id   : 'A-' + i,
 *                            name : 'items a ' + i,
 *                            data : 'aaaaaaaaaa' + i + 'aaaaaaaa'
 *                        });
 *
 *                        itemsB.push({
 *                            id   : 'B-' + i,
 *                            name : 'items b ' + i,
 *                            data : 'bbbbbbbbbb' + i + 'bbbbbbbbb'
 *                        });
 *
 *                     }
 *
 *                    // for custom search we hav to save item
 *                    $scope.fitemsB = itemsB;
 *                    $scope.fitemsA = itemsA;
 *
 *                    $scope.items = itemsA.concat(itemsB);
 *
 *                    // custome search function
 *                    $scope.searchItem = function (term) {
 *                        if (term) {
 *                            $scope.fitemsA = $filter('filter')(itemsA, {data : term});
 *                            $scope.fitemsB = $filter('filter')(itemsB, {data : term});
 *                        } else {
 *                            $scope.fitemsA = itemsA;
 *                            $scope.fitemsB = itemsB;
 *                        }
 *                    };
 *
 *                    // simple custom selection item
 *                    $scope.selectItem = function (item) {
 *                        console.log('item selected!', item);
 *                        $scope.term = item.name;
 *                    };
 *
 *                    $scope.hasItemsA = function() {
 *                        return $scope.fitemsA.length > 0;
 *                    };
 *
 *                    $scope.hasItemsB = function() {
 *                        return $scope.fitemsB.length > 0;
 *                    };
 *
 *            }]);;
 *        </script>
 *
 * </code>
 */
angular.module('ua.typeOff').directive('typeOff',
["$timeout",
function ($timeout) {
    "use strict";

    return {
        restrict    : 'A',
        transclude  : true,
        replace     : true,
        template    : '<div><form>' +
                '<input data-ng-model="term" data-ng-change="query()" type="text" autocomplete="off" /></form>' +
                '<div data-ng-transclude></div>' +
        '</div>',
        scope       : {
            search          : '&typeOffSearch',
            select          : '&typeOffSelect',
            items           : '=typeOffItems',
            term            : '=typeOffTerm',
            termpath        : '=typeOffTermPath',
            showWhenEmpty   : '=typeOffShowWhenEmpty'
        },
        controller : 'typeOffCtrl',
        link: function (scope, element, attrs, controller) {
            var $input = element.find('form > input'),
                $list = element.find('> div');

            $input.bind('focus', function() {
                scope.$apply(function () {
                    scope.focused = true;
                });
            });

            $input.bind('blur', function() {
                scope.$apply(function() {
                    scope.focused = false;
                });
            });

            $list.bind('mouseover', function() {
                scope.$apply(function() {
                    scope.mousedOver = true;
                });
            });

            $list.bind('mouseleave', function() {
                scope.$apply(function() {
                    scope.mousedOver = false;
                });
            });

            $input.bind('keyup', function(e) {
                if (e.keyCode === 9 || e.keyCode === 13) {
                    scope.$apply(function() {
                        controller.selectActive();
                        controller.query();
                        controller.hide();
                    });
                }

                if (e.keyCode === 27) {
                    scope.$apply(function() {
                        scope.hide = true;
                    });
                }
            });

            $input.bind('keydown', function(e) {
                if (e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27) {
                    e.preventDefault();
                }

                if (e.keyCode === 40) {

                    e.preventDefault();

                    scope.$apply(function() {
                        controller.activateNextItem();
                    });

                }

                if (e.keyCode === 38) {
                    e.preventDefault();
                    scope.$apply(function() {
                        controller.activatePreviousItem();
                    });
                }
            });

            scope.$watch('items', function (items) {
                controller.activate(items.length > 0 ? items[0] : null);
            });

            scope.$watch('focused', function(focused) {
                if (focused) {
                    $timeout(function() {
                        $input.focus();
                    }, 0, false);
                }
            });

            scope.$watch('isVisible()', function (visible) {
                var pos, height;

                if (visible) {
                    pos = $input.position();
                    height = $input[0].offsetHeight;

                    $list.css({
                        top      : pos.top + height,
                        left     : pos.left,
                        position : 'absolute',
                        display  : 'block'
                    });

                } else {
                    $list.css('display', 'none');
                }
            });
        }
    };
}]);
