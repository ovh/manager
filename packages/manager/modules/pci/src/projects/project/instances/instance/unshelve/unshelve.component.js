import controller from './unshelve.controller';
import template from './unshelve.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    instance: '<',
    projectId: '<',
  },
};
