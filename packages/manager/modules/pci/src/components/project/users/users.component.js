import controller from './users.controller';
import template from './users.html';

export default {
  controller,
  template,
  bindings: {
    addUser: '<',
    deleteUser: '<',
    downloadOpenStackOpenRc: '<',
    downloadOpenStackRclone: '<',
    editRoles: '<',
    showKey: '<',
    showCert: '<',
    showUserInformations: '<',
    generateOpenStackToken: '<',
    goToModifyPassword: '<?',
    generateS3Credentials: '<',
    guideUrl: '<?',
    hideRolesMatrix: '<?',
    isActionDisabled: '<?',
    openStackHorizonLink: '<',
    projectId: '<',
    regeneratePassword: '<?',
    roles: '<',
    users: '<',
  },
};
