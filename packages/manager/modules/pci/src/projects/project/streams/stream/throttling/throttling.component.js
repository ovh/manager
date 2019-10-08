import controller from './throttling.controller';
import template from './throttling.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    stream: '<',
    goBack: '<',
  },
};
