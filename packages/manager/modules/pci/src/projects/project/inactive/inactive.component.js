import template from './inactive.html';
import controller from './inactive.controller';

export default {
  template,
  controller,
  bindings: {
    goBack: '<',
    goToBilling: '<',
    goToNewProject: '<',
    goToProject: '<',
    project: '<',
  },
};
