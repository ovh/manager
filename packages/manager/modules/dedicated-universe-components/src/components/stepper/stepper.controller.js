import filter from 'lodash/filter';

import Navigation from './stepper.navigation';
import StepCollection from './stepper.step-collection';
import TransitionManagement from './stepper.transition-management';

import { NAVIGATION } from './step/step.constants';

export default class {
  /* @ngInject */
  constructor($state, $stateRegistry, $transitions) {
    this.$state = $state;
    this.$stateRegistry = $stateRegistry;
    this.$transitions = $transitions;
  }

  $onInit() {
    this.stepCollection = new StepCollection(this.steps);
    this.navigation = new Navigation(
      this.$state,
      this.$stateRegistry,
      this.stepCollection,
    );
    this.transitionManagement = new TransitionManagement(
      this.$state,
      this.$transitions,
    );

    this.bindings = {
      header: {
        steps: filter(this.steps, (step) => step.header.isVisible),
      },
    };

    this.transitionManagement.setUpTransitions(this.setLoading.bind(this));

    return this.currentStep
      ? this.navigation.goToStep(this.currentStep)
      : this.navigation.goToStep(NAVIGATION.FIRST_STEP);
  }

  setLoading(isLoading) {
    this.isLoadingBetweenSteps = isLoading;
  }

  doesStepExist(step) {
    return this.stepCollection.doesStepExist(step);
  }

  getStep(step) {
    return this.stepCollection.getStep(step);
  }

  memorizeParameters(params) {
    this.params = { ...this.params, ...params };
  }

  goToStep(step, params) {
    this.memorizeParameters(params);

    return this.navigation.goToStep(step, this.params);
  }

  close(transitionOptions) {
    return this.navigation.close(transitionOptions);
  }
}
