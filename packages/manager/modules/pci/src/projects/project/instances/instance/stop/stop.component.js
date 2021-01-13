import controller from './stop.controller';
import template from './stop.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    instance: '<',
    projectId: '<',
  },
};
