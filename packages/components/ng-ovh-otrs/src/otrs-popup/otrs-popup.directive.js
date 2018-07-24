angular.module("ovh-angular-otrs")
    .directive("otrsPopup", function () {
        "use strict";
        return {
            restrict: "A",
            scope: {},
            replace: false,
            templateUrl: "app/module-otrs/otrs-popup/otrs-popup.html",
            link: function ($scope, $element) {
                $scope.status = {
                    minimize: false,
                    maximize: false,
                    close: true
                };

                $scope.minimize = function () {
                    $scope.status.maximize = false;
                    $scope.status.minimize = true;
                    $scope.status.close = false;
                };

                $scope.maximize = function () {
                    $scope.status.maximize = true;
                    $scope.status.minimize = false;
                    $scope.status.close = false;
                };

                $scope.restore = function () {
                    $scope.status.maximize = false;
                    $scope.status.minimize = false;
                    $scope.status.close = false;
                };

                $scope.toggle = function () {
                    if ($scope.status.maximize || $scope.status.minimize) {
                        $scope.restore();
                    } else {
                        $scope.maximize();
                    }
                };

                $scope.open = function () {
                    $scope.restore();
                    $scope.status.close = false;
                };

                $scope.close = function () {
                    $scope.restore();
                    $scope.status.close = true;
                };

                $scope.$on("otrs.popup.maximize", $scope.maximize);
                $scope.$on("otrs.popup.minimize", $scope.minimize);
                $scope.$on("otrs.popup.restore", $scope.restore);
                $scope.$on("otrs.popup.toggle", $scope.toggle);
                $scope.$on("otrs.popup.open", $scope.open);
                $scope.$on("otrs.popup.close", $scope.close);

                $element.children(".otrs-popup.draggable").one("drag", function (event, ui) {
                    ui.helper.removeClass("otrs-popup-initial");
                });
            }
        };
    });
