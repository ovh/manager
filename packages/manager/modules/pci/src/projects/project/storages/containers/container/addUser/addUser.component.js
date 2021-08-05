import controller from './addUser.controller';
import template from './addUser.html';

export default {
  controller,
  template,
  bindings: {
    availableUsers: '<',
    archive: '<',
    projectId: '<',
    containerId: '<',
    container: '<',
    objectKey: '<',
    goBack: '<',
    goToUsersAndRoles: '<',
  },
};
