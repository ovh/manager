angular.module("ovh-angular-responsive-tabs", []);

angular.module("ovh-angular-responsive-tabs")
    .directive("responsiveTabMore", ["$state", function ($state) {
        "use strict";
        return {
            restrict: "AE",
            require: "^responsiveTabs",
            replace: true,
            transclude: true,
            templateUrl: "ovh-angular-responsive-tab-more/ovh-angular-responsive-tab-more.html",
            scope: {},
            compile: function () {
                return function ($scope, elm, attrs, tabsetCtrl) {

                    $scope.$tab = $(elm);

                    $scope.tabs = tabsetCtrl.tabs;

                    // When select a tab in the dropdown, the "active" var switch to true,
                    // so it trigger the $watch('active') from the original tab.
                    $scope.select = function (selectedTab) {
                        if (!selectedTab.disabled) {
                            $state.go(selectedTab.state, selectedTab.stateParams, selectedTab.stateOptions);
                            tabsetCtrl.select(selectedTab);
                        }
                    };

                    tabsetCtrl.addTabMore($scope);
                };
            }
        };
    }]
    );

angular.module("ovh-angular-responsive-tabs")
    .directive("responsiveTab", ["$parse", "$state", function ($parse, $state) {
        "use strict";
        return {
            restrict: "AE",
            require: "^responsiveTabs",
            replace: true,
            transclude: true,
            templateUrl: function (elm, attrs) {
                if (angular.isDefined(attrs.dropdown)) {
                    return "ovh-angular-responsive-tab/ovh-angular-responsive-tab-dropdown.html";
                } else if (angular.isDefined(attrs.url)) {
                    return "ovh-angular-responsive-tab/ovh-angular-responsive-tab-url.html";
                }
                return "ovh-angular-responsive-tab/ovh-angular-responsive-tab-default.html";

            },
            scope: {
                // "disabled" is below
                onSelect: "&select",
                state: "@",
                stateParams: "@",
                stateOptions: "@",
                dropdownTitle: "@",
                dropdownTitleTemplate: "@",
                url: "@",
                target: "@"
            },
            compile: function () {
                return function ($scope, elm, attrs, tabsetCtrl) {
                    $scope.$tab = $(elm);

                    $scope.hidden = false;

                    if ($scope.state) {
                        $scope.stateParams = $scope.stateParams || {};
                        $scope.stateOptions = $scope.stateOptions || {};
                        if ($state.includes($scope.state, $scope.stateParams, $scope.stateOptions)) {
                            // when responsive-tab wasn't in the DOM (ng-if)
                            tabsetCtrl.select($scope);
                        }
                    } else if ($scope.url) {
                        $scope.target = "_self";
                    }

                    // If no params, take the brutal html inside original tab, for the dropdown.
                    if (!$scope.dropdownTitle && !$scope.dropdownTitleTemplate) {
                        $scope.title = $scope.$tab.find("> a").html();
                    }

                    // When user select a tab, "active" switch to true,
                    // and trigger the $watch('active'), which select into the ctrl and do the magic.
                    $scope.select = function () {
                        if (!$scope.disabled) {
                            $state.go($scope.state, $scope.stateParams, $scope.stateOptions);
                            tabsetCtrl.select($scope);
                        }
                    };

                    $scope.disabled = false;
                    if (attrs.disabled) {
                        $scope.$parent.$watch($parse(attrs.disabled), function (value) {
                            $scope.disabled = !!value;
                        });
                    }

                    tabsetCtrl.addTab($scope);

                    // Say to ctrl to remove it
                    $scope.$on("$destroy", function () {
                        tabsetCtrl.removeTab($scope);
                    });

                };
            }
        };
    }]
    );

angular.module("ovh-angular-responsive-tabs").controller("responsiveTabsCtrl", ["$scope", function ($scope) {
    "use strict";

    var ctrl = this;
    var tabs = ctrl.tabs = $scope.tabs = [];
    var tabMore = ctrl.tabMore = $scope.tabMore = {};

    ctrl.select = function (selectedTab) {
        // reset active state of old active tab
        angular.forEach(tabs, function (tab) {
            if (tab.active && tab !== selectedTab) {
                tab.active = false;
            }
        });
        selectedTab.active = true;

        selectedTab.onSelect();
    };

    ctrl.addTab = function (_tab) {
        tabs.push(_tab);
    };

    // Special add for the "more" tab
    ctrl.addTabMore = function (_tabMore) {
        tabMore.$tab = _tabMore.$tab;
        tabMore.tabs = _tabMore.tabs;
    };

    ctrl.removeTab = function (_tab) {
        var index = tabs.indexOf(_tab);

        // Select a new tab if the tab to be removed is selected and not destroyed
        if (_tab.active && tabs.length > 1 && !destroyed) {
            // If this is the last tab, select the previous tab. else, the next tab.
            var newActiveIndex = index === tabs.length - 1 ? index - 1 : index + 1;
            ctrl.select(tabs[newActiveIndex]);
        }
        tabs.splice(index, 1);
    };

    var destroyed;
    $scope.$on("$destroy", function () {
        destroyed = true;
    });

}]);

/**
 * @ngdoc directive
 * @name responsiveTabs.directive:responsiveTabs
 * @scope
 * @restrict EA
 * @description
 *
 *
 * To use responsiveTabs, you had to inject responsiveTabs as dependency and use it like this example
 * <pre>
 *  angular.module('myApp', ['ovh-angular-responsive-tabs']);
 * </pre>
 *
 *
 */
angular.module("ovh-angular-responsive-tabs").directive("responsiveTabs", ["$window", "$state", function ($window, $state) {
    "use strict";
    return {
        restrict: "AE",
        replace: true,
        transclude: true,
        templateUrl: "ovh-angular-responsive-tabs.html",
        controller: "responsiveTabsCtrl",
        scope: {
            immovable: "@",
            justified: "@",
            vertical: "@"
        },
        link: function ($scope, elm, attrs, tabsetCtrl) {

            var $wdw = $($window);
            var $root = $(elm);

            // Get (array) the size of the tabs, without the "more" tab
            function getTabsSize () {
                var i = 0,
                    l = tabsetCtrl.tabs.length,
                    tabsSize = [],
                    size;

                for (; i < l; i++) {
                    tabsetCtrl.tabs[i].$tab.removeClass("hidden"); // THIS IS OVERKILL, but here's a little cat: =^..^=
                    tabsetCtrl.tabs[i].hidden = false;
                    size = tabsetCtrl.tabs[i].$tab.width();
                    if (size > 0) {
                        tabsSize[i] = size;
                    }
                }
                return tabsSize;
            }

            // Get the size of the "more" tab
            function getMoreTabSize () {
                tabsetCtrl.tabMore.$tab.removeClass("hidden"); // Well..., an other one: <(^.^)>
                return tabsetCtrl.tabMore.$tab.width();
            }

            // Return an array of the visible elements
            function getVisibleTabs (maxWidth, activeTabIndex) {
                var visibleTabs = [];
                var tabsSize = getTabsSize();

                // Sum of visibles elements
                var sum = getMoreTabSize() + 40; // 40px: scrollbar tolerance

                // If not immovable, always make the active element visible
                if (!$scope.immovable) {
                    sum += tabsSize[activeTabIndex];
                    visibleTabs.push(activeTabIndex);
                }

                for (var i = 0, l = tabsetCtrl.tabs.length; i < l; i++) {
                    if ($scope.immovable || i !== activeTabIndex) {
                        sum += tabsSize[i];
                        if (sum > maxWidth) {
                            return visibleTabs; // Stop here
                        }
                        visibleTabs.push(i); // OK, continue

                    }
                }
                return visibleTabs;
            }

            function refreshMenu () {

                if (!tabsetCtrl.tabMore) {
                    return;
                }

                var maxWidth = $root.width();
                var activeTabIndex = _.findIndex(tabsetCtrl.tabs, { active: true });
                var visibleTabs = getVisibleTabs(maxWidth, activeTabIndex);

                // Important: Here, all the tabs are visible (see above)!
                // Now, we need to hide elements:

                if (visibleTabs.length < tabsetCtrl.tabs.length) {

                    // Hide all not eligibles elements
                    for (var i = 0, l = tabsetCtrl.tabs.length; i < l; i++) {
                        if (!~visibleTabs.indexOf(i)) {
                            tabsetCtrl.tabs[i].hidden = true;
                            tabsetCtrl.tabs[i].$tab.addClass("hidden").attr("aria-hidden", "true");
                        }
                    }

                } else {
                    // All elements are visible; hide "more" tab.
                    tabsetCtrl.tabMore.$tab.addClass("hidden").attr("aria-hidden", "true");
                }
            }

            // ---

            $scope.$watch("tabs.length", refreshMenu);

            $scope.$on("responsive-tabs-refresh", refreshMenu);

            $scope.$on("$stateChangeSuccess", function () {

                // At init, select the tab associated with the state.
                // ...or, if user manually modify the url, we need to select it.
                angular.forEach(tabsetCtrl.tabs, function (tab) {
                    if (!tab.active && $state.includes(tab.state, tab.stateParams, tab.stateOptions)) {
                        tabsetCtrl.select(tab);
                    }
                });

                refreshMenu();
            });

            var onResize = _.debounce(refreshMenu, 99);
            $wdw.bind("resize", onResize);

            $scope.$on("$destroy", function () {
                $wdw.unbind("resize", onResize);
            });

        }
    };
}]
);

angular.module('ovh-angular-responsive-tabs').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('ovh-angular-responsive-tab-more/ovh-angular-responsive-tab-more.html',
    "<li class=\"tab tab-more dropdown\" data-uib-dropdown data-is-open=isOpen><a href class=dropdown-toggle data-uib-dropdown-toggle data-ng-transclude></a><ul class=\"dropdown-menu dropdown-menu-right\" role=menu><li class=tab-more-tab data-ng-repeat=\"tab in tabs\" data-ng-class=\"{active: tab.active, disabled: tab.disabled}\" data-ng-if=tab.hidden><a href data-ng-click=select(tab) data-ng-if=\"tab.dropdownTitle && tab.state\" data-ng-bind=tab.dropdownTitle></a> <a href data-ng-click=select(tab) data-ng-if=\"tab.dropdownTitleTemplate && tab.state\" data-ng-include=tab.dropdownTitleTemplate></a> <a href data-ng-click=select(tab) data-ng-if=\"tab.title && tab.state\" data-ng-bind-html=tab.title></a> <a data-ng-href={{tab.url}} target=tab.target data-ng-if=\"tab.dropdownTitle && tab.url\" data-ng-bind=tab.dropdownTitle></a> <a data-ng-href={{tab.url}} target=tab.target data-ng-if=\"tab.dropdownTitleTemplate && tab.url\" data-ng-include=tab.dropdownTitleTemplate></a> <a data-ng-href={{tab.url}} target=tab.target data-ng-if=\"tab.title && tab.url\" data-ng-bind-html=tab.title></a></li></ul></li>"
  );


  $templateCache.put('ovh-angular-responsive-tab/ovh-angular-responsive-tab-default.html',
    "<li class=tab data-ng-class=\"{active: active, disabled: disabled}\"><a href data-ng-click=select() data-ng-transclude></a></li>"
  );


  $templateCache.put('ovh-angular-responsive-tab/ovh-angular-responsive-tab-dropdown.html',
    "<li class=tab data-ng-class=\"{\n" +
    "    active: active,\n" +
    "    disabled: disabled\n" +
    "}\" data-is-open=isOpen data-ng-transclude></li>"
  );


  $templateCache.put('ovh-angular-responsive-tab/ovh-angular-responsive-tab-url.html',
    "<li class=tab data-ng-class=\"{disabled: disabled}\"><a data-ng-href=\"{{ url }}\" target=\"{{ target }}\" data-ng-transclude></a></li>"
  );


  $templateCache.put('ovh-angular-responsive-tabs.html',
    "<div class=tab-container><ul class=\"nav nav-tabs\" data-ng-class=\"{\n" +
    "        'nav-stacked': vertical,\n" +
    "        'nav-justified': justified\n" +
    "    }\" data-ng-transclude></ul></div>"
  );

}]);
