import controller from './attach.controller';
import template from './attach.html';

export default {
  bindings: {
    goBack: '<',
    projectId: '<',
    goToDashboard: '<',
    saveRegistry: '<',
  },
  template,
  controller,
};
