import controller from './addUser.controller';
import template from './addUser.html';

export default {
  controller,
  template,
  bindings: {
    availableUsers: '<',
    archive: '<',
    container: '<',
    containerId: '<',
    goBack: '<',
    goToUsersAndRoles: '<',
    objectKey: '<',
    projectId: '<',
    trackingPrefix: '<',
  },
};
