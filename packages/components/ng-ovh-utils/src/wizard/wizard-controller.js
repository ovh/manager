/*
* controller for wizard directives
*/
angular.module('ua.wizard').controller('wizardCtrl',
['$scope',
function ($scope) {
    'use strict';

    $scope.currentStep = this.currentStep = 0;
    $scope.steps = this.steps = [];

    $scope.stepCount = 0;
    $scope.wizardTitle = '';
    $scope.wizardTitleIcon = '';
    $scope.confirmButton = true;
    $scope.cancelButton = true;
    $scope.keydownDisabled = false;
    $scope.wizardBreadCrumb = false;
    $scope.wizardConfirmButtonText = $scope.tr('wizard_confirm');
    $scope.wizardCancelButtonText = $scope.tr('wizard_cancel');
    $scope.wizardPreviousButtonText = $scope.tr('wizard_previous');
    $scope.wizardNextButtonText = $scope.tr('wizard_next');
    $scope.wizardCloseButton = true;
    $scope.wizardPreviousButton = true;

    $scope.onFinish = function () {};
    $scope.onCancel = function () {};

    var self = this;

    this.setStepCount = function (count) {
        $scope.stepCount = count;
        angular.forEach($scope.steps, function (step) {
            step.stepCount = $scope.stepCount;
        });
    };

    this.getStepCount = function () {
        return $scope.stepCount;
    };

    /*
     *Add step to the wizard
     */
    this.addStep = function (step) {
        this.steps.push(step);
    };

    /*
     *return the numbers of step
     */
    this.getStepCount = function () {
        return $scope.stepCount;
    };

    /*
     * got to the next step
     */
    this.nextStep = function () {
        $scope.$broadcast('wizard-stepChange');
        if (this.currentStep >= 0 && $scope.currentStep !== $scope.stepCount ||
            $scope.currentStep === 0 && $scope.stepCount === 0) {
            this.currentStep++;
            $scope.currentStep = this.currentStep;

            if (this.steps[this.currentStep - 1]) {
                this.steps[this.currentStep - 1].initHelper();
                if(angular.isFunction(this.steps[this.currentStep - 1].loadStep)) {
                    this.steps[this.currentStep - 1].loadStep();
                }
            }
        } else {
            $scope.onFinish();
        }
    };


    $scope.$on('wizard-goToStep', function (evt, stepNumber) {
        if (self.currentStep < stepNumber) {
            self.currentStep = $scope.currentStep = stepNumber - 1;
        } else {
            if (self.currentStep > stepNumber) {
                self.currentStep = $scope.currentStep = stepNumber;
            }
        }
    });

    /*
     * go to the previous step
     */
    this.previousStep = function () {
        $scope.$broadcast('wizard-stepChange');
        this.currentStep--;
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
    this.setTitle = function (title) {
        if (title !== undefined && title !== '') {
            $scope.wizardTitle = title;
        }
    };

    this.setTitleIcon = function (title) {
        if (title !== undefined && title !== '') {
            $scope.wizardTitleIcon = title;
        }
    };


    this.setConfirmButton = function (value) {
        $scope.confirmButton = value;
    };

    this.setCancelButton = function (value) {
        $scope.cancelButton = value;
    };

    this.setKeydownDisabled = function () {
        $scope.keydownDisabled = true;
    };

    this.setWizardBreadCrumb = function (value) {
        $scope.wizardBreadCrumb = value;
    };

    this.setWizardConfirmButtonText = function (value) {
        $scope.wizardConfirmButtonText = value;
    };

    this.setWizardCancelButtonText = function (value) {
        $scope.wizardCancelButtonText = value;
    };

    this.setWizardPreviousButtonText = function (value) {
        $scope.wizardPreviousButtonText = value;
    };

    this.setWizardNextButtonText = function (value) {
        $scope.wizardNextButtonText = value;
    };

    this.setWizardCloseButton = function(value) {
        $scope.wizardCloseButton = value;
    };

    this.setWizardPreviousButton = function(value) {
        $scope.wizardPreviousButton = value;
    };

}]);
