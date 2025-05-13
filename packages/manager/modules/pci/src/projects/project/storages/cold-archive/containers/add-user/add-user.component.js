import controller from './add-user.controller';
import template from './add-user.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    containerId: '<',
    container: '<',
    allUserList: '<',
    archive: '<',
    objectKey: '<',
    goBack: '<',
    goToUsersAndRoles: '<',
    trackClick: '<',
    trackPage: '<',
    regions: '<',
  },
};
