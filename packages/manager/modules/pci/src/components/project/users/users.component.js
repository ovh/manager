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
    generateOpenStackToken: '<',
    goToModifyPassword: '<?',
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
