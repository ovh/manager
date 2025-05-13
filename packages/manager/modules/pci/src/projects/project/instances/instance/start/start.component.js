import controller from './start.controller';
import template from './start.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    instance: '<',
    projectId: '<',
  },
};
