import wizardFormController from './wizardForm-controller';
import template from './wizardForm.html';

export default function () {
  return {
    restrict: 'A',
    controller: wizardFormController,
    transclude: true,
    template,
    link($scope, $elm, $attr, ctrl) {
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
        $scope.$watch($attr.wizardFormConfirmButtonText, (newText) => {
          ctrl.setWizardFormConfirmButtonText(newText);
        });
      }

      if ($attr.wizardFormCancelButtonText !== undefined) {
        $scope.$watch($attr.wizardFormCancelButtonText, (newText) => {
          ctrl.setWizardFormCancelButtonText(newText);
        });
      }
    },
  };
}
