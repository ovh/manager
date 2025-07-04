import forEach from 'lodash/forEach';
import set from 'lodash/set';

export default class {
  /* @ngInject */
  constructor($state, $stateRegistry) {
    // Each step is a child of the stepper
    // This is the root state of the stepper itself,
    // parent of the state of the first step
    this.$state = $state;
    this.rootState = $state.$current;
    this.$stateRegistry = $stateRegistry;
  }

  registerStatesFromSteps(steps) {
    let currentStateName = this.rootState.name;

    forEach(steps, (step) => {
      currentStateName = `${currentStateName}.${step.name}`;
      set(step, 'state.name', currentStateName);

      if (!this.$state.href(currentStateName)) {
        this.registerState(step.state);
      }
    });
  }

  registerState(state) {
    this.$stateRegistry.register({
      ...state,
      component: undefined,
      views: {
        [`content@${this.rootState.name}`]: state.component,
      },
    });
  }

  goToState(stateName, parameters) {
    return this.$state.go(stateName, parameters);
  }

  close(transitionOptions) {
    return this.$state.go(
      this.rootState.parent.parent.name,
      {},
      transitionOptions,
    );
  }
}
