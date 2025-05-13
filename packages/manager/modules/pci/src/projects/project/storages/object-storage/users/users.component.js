import controller from './users.controller';
import template from './users.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    userList: '<',
    goToImportPolicy: '<',
    goToDeleteUser: '<',
    goToUsersAndRoles: '<',
    goToUsers: '<',
    trackingPrefix: '<',
    downloadOpenStackRclone: '<',
    goToAddUser: '<',
    goToUsersBanner: '<',
    userDetails: '<',
    userCredential: '<',
    trackingInfo: '<',
    refreshS3Credentials: '<',
    isLocalzoneAvailable: '<',
  },
};
