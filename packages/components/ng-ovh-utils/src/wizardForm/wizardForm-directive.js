/**
 * Wizard form directive
 */
angular.module('ua.wizardForm').directive('wizardForm', function () {
    'use strict';
    return {
        restrict    : 'A',
        controller  : 'wizardFormCtrl',
        transclude  : true,
        templateUrl : 'components/ovh-utils-angular/wizardForm/wizardForm.html',
        link        : function ($scope, $elm, $attr, ctrl) {

            ctrl.initWatcher();

            if ($attr.wizardFormOnCancel) {
                $scope.onCancel = function () {
                    $scope[$attr.wizardFormOnCancel]();
                };
            }

            if ($attr.wizardFormOnFinish) {
                $scope.onFinish = function () {
                    $scope[$attr.wizardFormOnFinish]();
                };
            }

            if ($attr.wizardFormHideConfirmButton !== undefined) {
                ctrl.setConfirmButton(false);
            }

            if ($attr.wizardFormHideCancelButton !== undefined) {
                ctrl.setCancelButton(false);
            }

            if ($attr.wizardFormConfirmButtonText !== undefined) {
                $scope.$watch($attr.wizardFormConfirmButtonText, function (newText) {
                    ctrl.setWizardFormConfirmButtonText(newText);
                });
            }

            if ($attr.wizardFormCancelButtonText !== undefined) {
                $scope.$watch($attr.wizardFormCancelButtonText, function (newText) {
                    ctrl.setWizardFormCancelButtonText(newText);
                });
            }

        }
    };
});
