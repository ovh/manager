import angular from 'angular';

export default /* @ngInject */ function ($scope, $translate) {
  let initialized = false;

  let currentStep;

  $scope.steps = [];
  $scope.currentStep = undefined;

  $scope.confirmButton = true;
  $scope.cancelButton = true;
  $scope.wizardConfirmButtonText = $translate.instant('ua_wizard_confirm');
  $scope.wizardCancelButtonText = $translate.instant('ua_wizard_cancel');

  $scope.onFinish = angular.noop;
  $scope.onCancel = angular.noop;

  this.initWatcher = function () {
    initialized = true;
    this.checkStepShow();
  };

  // Watcher
  this.checkStepShow = function () {
    if (!initialized) {
      return;
    }
    currentStep = undefined;

    angular.forEach($scope.steps, (stepParams, count) => {
      const step = stepParams;
      if (currentStep !== undefined) {
        if (count > currentStep) {
          step.stepShown = false;
        }
      } else {
        step.stepShown = true;
        if (!step.stepValid) {
          currentStep = count;
        }
      }
    });
    $scope.currentStep = currentStep;
    if (currentStep === undefined) {
      $scope.stepFormValid = true;
    } else {
      $scope.stepFormValid = false;
    }
  };

  this.addStep = function (step) {
    $scope.steps.push(step);
  };

  this.getStepCount = function () {
    return $scope.steps.length;
  };

  /**
   * Buttons
   */

  this.setConfirmButton = function (value) {
    $scope.confirmButton = value;
  };

  this.setCancelButton = function (value) {
    $scope.cancelButton = value;
  };

  this.setWizardFormConfirmButtonText = function (value) {
    $scope.wizardConfirmButtonText = value;
  };

  this.setWizardFormCancelButtonText = function (value) {
    $scope.wizardCancelButtonText = value;
  };
}
