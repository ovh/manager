/**
 * @type service
 * @name ovhServices:step
 * @description
 * Add step managment on html view.
 * # Usage
 * Add `step` service on view controller and call `inject` method to add fonctionality to the given scope.
 * @example
 * Html view :
 *<code:html>
 *<div data-ng-controller="MyController">
 *   <div data-ng-show="step.isStep(1)">
 *      <!-- step 1 -->
 *      ...
 *      <button type="button" data-ng-click="step.nextStep()">Next</button>
 *   </div>
 *   <div data-ng-show="step.isStep(2)">
 *      <!-- step 2 -->
 *      ...
 *      <button type="button" data-ng-click="step.previousStep()">Back</button>
 *      <button type="button" data-ng-click="step.nextStep()">Next</button>
 *   </div>
 *   <div data-ng-show="step.isStep(3)">
 *      <!-- step 3 -->
 *      ...
 *      <button type="button" data-ng-click="step.previousStep()">Back</button>
 *   </div>
 *</div>
 *</code>
 * Javascript view controller :
 *<code:js>
 *var MyController = function(scope, translator, step) {
 *   step.inject(scope);
 *   step.onChange(function(event) {
 *      switch(event.current) {
 *         case 2:
 *            // TODO
 *            break;
 *
 *         case 3:
 *            // TODO
 *            break;
 *
 *         default:
 *            // TODO
 *      }
 *   });
 *};
 *MyController.$inject = ['$scope', 'translator', 'step'];
 *</code>
 */
angular.module('ua.step').factory('step', function () {
    'use strict';

    var stepObj = {};

    stepObj.currentStep = 1;

    stepObj.onChangeCallback = [];

    stepObj.isStep = function (step) {
        return this.currentStep === step;
    };

    /**
    * @type function
    * @name ovhServices:step.setStep
    * @description
    * Change step to the given number
    * @param {integer} step step number
    */
    stepObj.setStep = function (step) {
        var evt = null, evtIdx;

        if (this.step !== step) {
            evt = {
                'previous': this.currentStep,
                'current': step
            };

            evtIdx = 0;
            this.currentStep = step;
            if (this.onChangeCallback.length > 0) {
                for (evtIdx = 0 ; evtIdx < this.onChangeCallback.length ; evtIdx++) {
                    this.onChangeCallback[evtIdx](evt);
                }
            }
        }
    };

    /**
    * @type function
    * @name ovhServices:step.hasPreviousStep
    * @description
    * Check if has a previous step
    * @return {boolean} true if has a previous step
    */
    stepObj.hasPreviousStep = function () {
        return this.currentStep > 1;
    };

    /**
    * @type function
    * @name ovhServices:step.onChange
    * @description
    * Listener called on step change with event object : `{current: current_step_number, previous: previous_step_number}`
    * @param {function} callback callback function
    */
    stepObj.onChange = function (callback) {
        if (angular.isFunction(callback)) {
            this.onChangeCallback.push(callback);
        }
    };

    /**
    * @type function
    * @name ovhServices:step.nextStep
    * @description
    * Change step to next
    */
    stepObj.nextStep = function () {
        this.setStep(stepObj.currentStep + 1);
    };
    /**
    * @type function
    * @name ovhServices:step.previousStep
    * @description
    * Change step to previous
    */
    stepObj.previousStep = function () {
        this.setStep(stepObj.currentStep - 1);
    };
    /**
    * @type function
    * @name ovhServices:step.resetStep
    * @description
    * Change step to first
    */
    stepObj.resetStep = function () {
        this.setStep(1);
    };

   /**
    * @type function
    * @name ovhServices:step.inject
    * @description
    * Add step methods to the given scope
    * @param {scope} scope scope to add methods
    **/
    stepObj.inject = function (scope) {

        this.onChangeCallback = [];

        this.resetStep();

        scope.step = this;
    };

    return stepObj;
});
