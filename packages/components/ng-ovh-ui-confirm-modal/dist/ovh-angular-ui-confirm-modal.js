/**
 * @ngdoc directive
 * @name ovh-angular-ui-confirm-modal.directive:ngReallyClick
 * @scope
 * @restrict EA
 * @description
 *
 * Implement confirmation modal
 *
 * To use ovh-angular-ui-confirm-modal, you had to inject ovh-angular-ui-confirm-modal as dependency and use it like this example
 * <pre>
 *  angular.module('myApp', ['angular-ui-confirm-modal]);
 * </pre>
 *
 *
 */
angular.module("ovh-angular-ui-confirm-modal", [])
.directive('ngReallyClick',
    ["$uibModal", function ($uibModal) {
        "use strict";

        return {
            restrict: 'EA',
            link: function(scope, element, attrs) {
                var confirmButton = attrs.ngReallyConfirm || 'OK';
                var cancelButton = attrs.ngReallyCancel || 'Cancel';

                element.click(function() {
                    var clickAction = attrs.ngReallyClick;
                    var clickUndo = attrs.ngReallyUndo;

                    var template = attrs.ngReallyTitle ? '<div class="modal-header">' + attrs.ngReallyTitle + '</div>' : '';
                    template += '<div class="modal-body">' + attrs.ngReallyMessage + '</div>' +
                        '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-primary" ng-click="$close(\'ok\')">' + confirmButton + '</button>' +
                            '<button type="button" class="btn btn-default btn-cancel" ng-click="$dismiss(\'cancel\')">' + cancelButton + '</button>' +
                        '</div>';

                    $uibModal
                        .open({
                            template: template,
                            windowClass: attrs.ngReallyWindowClass
                        })
                        .result.then(
                            function() {
                                scope.$eval(clickAction);
                            },
                            function() {
                                if (clickUndo) {
                                    scope.$eval(clickUndo);
                                }
                            }
                        )
                    ;
                });
            }
        };
    }]
);

angular.module("ovh-angular-ui-confirm-modal", []);
