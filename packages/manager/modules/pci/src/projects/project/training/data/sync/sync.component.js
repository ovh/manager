import controller from './sync.controller';
import template from './sync.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    data: '<',
    projectId: '<',
  },
};
