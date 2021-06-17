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
