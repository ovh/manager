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
    guideUrl: '<',
    openStackHorizonLink: '<',
    projectId: '<',
    roles: '<',
    users: '<',
  },
};
