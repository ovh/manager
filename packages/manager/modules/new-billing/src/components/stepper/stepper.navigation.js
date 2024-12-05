import StateManagement from './stepper.state-management';

export default class {
  /* @ngInject */
  constructor($state, $stateRegistry, stepCollection) {
    this.stateManagement = new StateManagement($state, $stateRegistry);
    this.stepCollection = stepCollection;
    this.stateManagement.registerStatesFromSteps(stepCollection.steps);
  }

  goToStep({ name, index, relativeIndex }, parameters) {
    const step = this.stepCollection.getStep({ name, index, relativeIndex });
    this.stepCollection.changeCurrentStep({ name, index, relativeIndex });

    return this.stateManagement.goToState(step.state.name, parameters);
  }

  close(transitionOptions) {
    return this.stateManagement.close(transitionOptions);
  }
}
