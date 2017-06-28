angular.module("ovh-angular-responsive-tabs")
    .directive("responsiveTabMore", function ($state) {
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
    }
    );
