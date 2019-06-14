import template from './new.html';
import controller from './new.controller';

export default {
  template,
  controller,
  bindings: {
    contracts: '<',
    getCurrentStep: '<',
    getStepByName: '<',
    getStateLink: '<',
    newProjectInfo: '<',
    onProjectCreated: '<',
    onDescriptionStepFormSubmit: '<',
    hasCreditToOrder: '<',
    paymentStatus: '<',
    paymentMethodUrl: '<',
    shouldProcessChallenge: '<',
    steps: '<',
    dlpStatus: '<',
  },
};
