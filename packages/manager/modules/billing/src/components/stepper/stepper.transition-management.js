import forEach from 'lodash/forEach';

export default class {
  /* @ngInject */
  constructor($state, $transitions) {
    this.$state = $state;
    this.$transitions = $transitions;

    this.transitionUnregistrationHooks = [];
  }

  setUpTransitions(isLoadingCallback) {
    this.setUpTransitionsBetweenSteps(isLoadingCallback);
    this.setUpCloseTransition();
  }

  setUpTransitionsBetweenSteps(isLoadingCallback) {
    const transitionBetweenStepsCriteria = {
      from: `${this.$state.$current.name}.**`,
      to: `${this.$state.$current.name}.**`,
    };

    this.transitionUnregistrationHooks = [
      ...this.transitionUnregistrationHooks,
      this.$transitions.onStart(transitionBetweenStepsCriteria, () => {
        isLoadingCallback(true);
      }),
      this.$transitions.onSuccess(transitionBetweenStepsCriteria, () => {
        isLoadingCallback(false);
      }),
    ];
  }

  setUpCloseTransition() {
    const closeTransitionCriteria = {
      to: this.$state.$current.parent.name,
    };

    this.transitionUnregistrationHooks.push(
      // on closing the stepper state...
      this.$transitions.onStart(closeTransitionCriteria, () => {
        // ... unregister all the transitions
        forEach(this.transitionUnregistrationHooks, (hook) => hook());
      }),
    );
  }
}
