import _ from 'lodash';

export default class {
  constructor(
    steps,
    indexOfCurrentStep = 0,
  ) {
    this.steps = _.map(
      steps,
      (step, index) => {
        _.set(step, 'index', index);
        return step;
      },
    );

    this.indexOfCurrentStep = indexOfCurrentStep;
  }

  validateStepIndex(index) {
    if (index < 0) {
      throw new RangeError(`Stepper: minimum allowed index is 0 (input was ${index})`);
    }

    if (index >= this.steps.length) {
      throw new RangeError(`Stepper: maximum allowed index is ${this.steps.length - 1} (input was ${index})`);
    }
  }

  doesStepExist({ name, index, relativeIndex }) {
    try {
      return this.getStep({ name, index, relativeIndex }) && true;
    } catch (error) {
      return false;
    }
  }

  getStep({ name, index, relativeIndex }) {
    const matchingStep = this.getStepByName(name)
      || (Number.isFinite(index) && this.getStepByIndex(index))
      || (Number.isFinite(relativeIndex) && this.getStepByRelativeIndex(relativeIndex));

    if (matchingStep == null) {
      throw new RangeError(`Stepper: the step could not be found (input was { name: ${name}, index: ${index} })`);
    }

    return matchingStep;
  }

  getStepByName(name) {
    return _.find(
      this.steps,
      { name },
    );
  }

  getStepByIndex(index) {
    return this.validateStepIndex(index) || this.steps[index];
  }

  getStepByRelativeIndex(relativeIndex) {
    const index = this.indexOfCurrentStep + relativeIndex;
    return this.getStepByIndex(index);
  }

  changeCurrentStep(step) {
    const stepToSetAsCurrent = this.getStep(step);
    stepToSetAsCurrent.setAsActive();
    this.indexOfCurrentStep = stepToSetAsCurrent.index;
    this.setStepsBeforeCurrentStepAsCompleted();
    this.setStepsAfterCurrentStepAsToBeDone();
  }

  setStepsBeforeCurrentStepAsCompleted() {
    _.forEach(
      _.slice(this.steps, 0, this.indexOfCurrentStep),
      step => step.setAsCompleted(),
    );
  }

  setStepsAfterCurrentStepAsToBeDone() {
    _.forEach(
      _.slice(this.steps, this.indexOfCurrentStep + 1, this.steps.length),
      step => step.setAsToBeDone(),
    );
  }
}
