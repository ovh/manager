import find from 'lodash/find';
import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';

import Step from './step';

export default class Stepper {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateRegistry,
    $transitions,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateRegistry = $stateRegistry;
    this.$transitions = $transitions;
  }

  $onInit() {
    this.memorizedStateParams = {};
    this.transitionUnregistrationHooks = [];
    // Each step is a child of the stepper
    // This is the name of the state of the stepper itself,
    // parent of the state of the first step
    this.stepperRootStateName = this.$state.$current.name;
    // Name of the state that called the stepper
    this.stepperParentStateName = this.$state.$current.parent.name;

    this.registerStepStates();
    this.setUpTransitionsBetweenSteps();
    this.setUpExitTransition();

    return this.goToStep(find(this.steps, { name: this.currentStep }) || head(this.steps));
  }

  registerStepStates() {
    let currentStateName = this.stepperRootStateName;

    this.steps.forEach((step) => {
      currentStateName = `${currentStateName}.${step.name}`;

      if (!this.$state.href(currentStateName)) {
        this.$stateRegistry.register({
          ...step.state,
          name: currentStateName,
          views: {
            [`content@${this.stepperRootStateName}`]: step.componentName,
          },
        });
      }
    });
  }

  setUpTransitionsBetweenSteps() {
    const transitionBetweenStepsCriteria = {
      from: `${this.stepperRootStateName}.**`,
      to: `${this.stepperRootStateName}.**`,
    };

    this.transitionUnregistrationHooks.push(
      this.$transitions.onStart(transitionBetweenStepsCriteria, () => {
        this.isLoadingBetweenSteps = true;
      }),
    );

    this.transitionUnregistrationHooks.push(
      this.$transitions.onSuccess(transitionBetweenStepsCriteria, () => {
        this.isLoadingBetweenSteps = false;
      }),
    );
  }

  setUpExitTransition() {
    const exitTransitionCriteria = {
      to: this.stepperParentStateName,
    };

    this.transitionUnregistrationHooks.push(
      this.$transitions.onStart(exitTransitionCriteria, () => {
        this.transitionUnregistrationHooks.forEach(hook => hook());
      }),
    );
  }

  doesStepExist(step) {
    return find(
      this.steps,
      { name: step.name },
    ) != null;
  }

  validateStepArgument(step) {
    if (!(step instanceof Step)) {
      throw new TypeError('Stepper.validateStepArgument: "step" parameter is not an instance of Step');
    }

    if (!this.doesStepExist(step)) {
      throw new RangeError(`Stepper.validateStepArgument: "${step.name}" step was not found`);
    }
  }

  goToStep(step, stateParams = {}) {
    this.validateStepArgument(step);

    this.activateStep(step);

    const completedStepNames = this.steps
      .filter(currentStep => currentStep.isComplete)
      .map(currentStep => currentStep.name);

    this.memorizedStateParams = { ...this.memorizedStateParams, ...stateParams };
    const destinationStepName = `${this.stepperRootStateName}.${[...completedStepNames, ''].join('.')}${this.activeStep.value.name}`;
    return this.$state.go(destinationStepName, this.memorizedStateParams);
  }

  exit(reload = false) {
    return this.$state.go(this.stepperParentStateName, {}, { reload });
  }

  activateStep(stepToActivate) {
    this.validateStepArgument(stepToActivate);

    let stepToActivateWasFound = false;

    this.steps.forEach((currentStep, index) => {
      const currentStepIsStepToActivate = currentStep.name === stepToActivate.name;

      if (currentStepIsStepToActivate) {
        stepToActivateWasFound = true;
        currentStep.setAsActive();
        this.activeStep = {
          value: currentStep,
          index,
        };
      } else if (stepToActivateWasFound) {
        currentStep.setAsToBeDone();
      } else {
        currentStep.setAsCompleted();
      }
    });
  }

  $onChanges({ steps }) {
    if (!isEmpty(steps)) {
      this.steps = steps.currentValue;
    }
  }

  goToNextStep(stateParams = {}) {
    const nextStep = this.steps[this.activeStep.index + 1];

    if (nextStep == null) {
      return this.exit(true);
    }

    return this.goToStep(nextStep, stateParams);
  }

  goToPreviousStep(stateParams = {}) {
    return this.goToStep(this.steps[this.activeStep.index - 1], stateParams);
  }
}
