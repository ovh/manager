import controller from './dedicatedCloud-user.controller';
import template from './dedicatedCloud-user.html';

export default {
  bindings: {
    addUser: '<',
    dedicatedCloud: '<',
    deleteUser: '<',
    disableUser: '<',
    editUser: '<',
    enableUser: '<',
    modifyUserRights: '<',
    nsxUnavailable: '<',
    passwordReset: '<',
    productId: '<',
    setMessage: '<',
  },
  controller,
  template,
};
