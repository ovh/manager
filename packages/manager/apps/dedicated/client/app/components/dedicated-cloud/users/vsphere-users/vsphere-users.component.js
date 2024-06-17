import controller from './vsphere-users.controller';
import template from './vsphere-users.html';

export default {
  bindings: {
    addUser: '<',
    dedicatedCloud: '<',
    deleteUser: '<',
    disableUser: '<',
    editUser: '<',
    enableUser: '<',
    modifyUserRights: '<',
    optionsAvailable: '<',
    hasNsxOption: '<',
    passwordReset: '<',
    productId: '<',
    setMessage: '<',
    goToUserIamRole: '<',
    trackClick: '<',
    trackPage: '<',
  },
  controller,
  template,
};
