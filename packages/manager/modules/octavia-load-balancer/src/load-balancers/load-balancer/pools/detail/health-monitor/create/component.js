import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    pool: '<',
    goToDashboard: '<',
  },
  controller,
  template,
};
