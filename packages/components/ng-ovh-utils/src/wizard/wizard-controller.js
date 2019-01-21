import angular from 'angular';

export default /* @ngInject */ function ($scope, $translate) {
  this.currentStep = 0;
  $scope.currentStep = this.currentStep;

  this.steps = [];
  $scope.steps = this.steps;

  $scope.stepCount = 0;
  $scope.wizardTitle = '';
  $scope.wizardTitleIcon = '';
  $scope.confirmButton = true;
  $scope.cancelButton = true;
  $scope.keydownDisabled = false;
  $scope.wizardBreadCrumb = false;
  $scope.wizardConfirmButtonText = $translate.instant('ua_wizard_confirm');
  $scope.wizardCancelButtonText = $translate.instant('ua_wizard_cancel');
  $scope.wizardPreviousButtonText = $translate.instant('ua_wizard_previous');
  $scope.wizardNextButtonText = $translate.instant('ua_wizard_next');
  $scope.wizardCloseButton = true;
  $scope.wizardPreviousButton = true;

  $scope.onFinish = function onFinish() {};
  $scope.onCancel = function onCancel() {};

  const self = this;

  this.setStepCount = function setStepCount(count) {
    $scope.stepCount = count;
    angular.forEach($scope.steps, (stepParam) => {
      const step = stepParam;
      step.stepCount = $scope.stepCount;
    });
  };

  this.getStepCount = function getStepCount() {
    return $scope.stepCount;
  };

  /*
     *Add step to the wizard
     */
  this.addStep = function addStep(step) {
    this.steps.push(step);
  };

  /*
     *return the numbers of step
     */
  this.getStepCount = function getStepCount() {
    return $scope.stepCount;
  };

  /*
     * got to the next step
     */
  this.nextStep = function nextStep() {
    $scope.$broadcast('wizard-stepChange');
    if (
      (this.currentStep >= 0 && $scope.currentStep !== $scope.stepCount)
      || ($scope.currentStep === 0 && $scope.stepCount === 0)
    ) {
      this.currentStep += 1;
      $scope.currentStep = this.currentStep;

      if (this.steps[this.currentStep - 1]) {
        this.steps[this.currentStep - 1].initHelper();
        if (angular.isFunction(this.steps[this.currentStep - 1].loadStep)) {
          this.steps[this.currentStep - 1].loadStep();
        }
      }
    } else {
      $scope.onFinish();
    }
  };

  $scope.$on('wizard-goToStep', (evt, stepNumber) => {
    if (self.currentStep < stepNumber) {
      $scope.currentStep = stepNumber - 1;
      self.currentStep = $scope.currentStep;
    } else if (self.currentStep > stepNumber) {
      $scope.currentStep = stepNumber;
      self.currentStep = $scope.currentStep;
    }
  });

  /*
     * go to the previous step
     */
  this.previousStep = function previousStep() {
    $scope.$broadcast('wizard-stepChange');
    this.currentStep -= 1;
    $scope.currentStep = this.currentStep;

    if ($scope.currentStep === 0) {
      $scope.onCancel();
    }

    if (this.steps[this.currentStep - 1]) {
      this.steps[this.currentStep - 1].initHelper();
    }
  };

  /*
     *set the title
     */
  this.setTitle = function setTitle(title) {
    if (title !== undefined && title !== '') {
      $scope.wizardTitle = title;
    }
  };

  this.setTitleIcon = function setTitleIcon(title) {
    if (title !== undefined && title !== '') {
      $scope.wizardTitleIcon = title;
    }
  };

  this.setConfirmButton = function setConfirmButton(value) {
    $scope.confirmButton = value;
  };

  this.setCancelButton = function setCancelButton(value) {
    $scope.cancelButton = value;
  };

  this.setKeydownDisabled = function setKeydownDisabled() {
    $scope.keydownDisabled = true;
  };

  this.setWizardBreadCrumb = function setWizardBreadCrumb(value) {
    $scope.wizardBreadCrumb = value;
  };

  this.setWizardConfirmButtonText = function setWizardConfirmButtonText(value) {
    $scope.wizardConfirmButtonText = value;
  };

  this.setWizardCancelButtonText = function setWizardCancelButtonText(value) {
    $scope.wizardCancelButtonText = value;
  };

  this.setWizardPreviousButtonText = function setWizardPreviousButtonText(value) {
    $scope.wizardPreviousButtonText = value;
  };

  this.setWizardNextButtonText = function setWizardNextButtonText(value) {
    $scope.wizardNextButtonText = value;
  };

  this.setWizardCloseButton = function setWizardCloseButton(value) {
    $scope.wizardCloseButton = value;
  };

  this.setWizardPreviousButton = function setWizardPreviousButton(value) {
    $scope.wizardPreviousButton = value;
  };
}
