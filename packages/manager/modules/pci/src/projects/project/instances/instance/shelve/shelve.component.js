import controller from './shelve.controller';
import template from './shelve.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    instance: '<',
    projectId: '<',
  },
};
