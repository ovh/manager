import controller from './addUser.controller';
import template from './addUser.html';

export default {
  controller,
  template,
  bindings: {
    archive: '<',
    projectId: '<',
    containerId: '<',
    container: '<',
    goBack: '<',
  },
};
