import controller from './resume.controller';
import template from './resume.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    instance: '<',
    goBack: '<',
  },
};
