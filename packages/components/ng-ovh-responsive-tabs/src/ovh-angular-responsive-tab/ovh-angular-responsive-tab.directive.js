angular.module("ovh-angular-responsive-tabs")
    .directive("responsiveTab", function ($parse, $state) {
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
    }
    );
