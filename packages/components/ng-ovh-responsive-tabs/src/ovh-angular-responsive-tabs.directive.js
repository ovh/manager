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
angular.module("ovh-angular-responsive-tabs").directive("responsiveTabs", function ($window, $state) {
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
}
);
