import controller from './unrescue.controller';
import template from './unrescue.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    instance: '<',
    goBack: '<',
  },
};
