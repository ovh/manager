import controller from './update.controller';
import template from './update.html';

export default {
  bindings: {
    currentService: '<',
    goBack: '<',
    operationsUrl: '<',
    targetVersion: '<',
  },
  controller,
  template,
};
