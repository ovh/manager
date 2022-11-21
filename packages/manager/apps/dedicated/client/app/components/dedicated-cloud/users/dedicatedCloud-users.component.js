import template from './dedicatedCloud-users.html';

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
    passwordReset: '<',
    productId: '<',
    setMessage: '<',
    goToImportUser: '<',
    goToAddFederation: '<',
    goToDeleteFederation: '<',
    goToEditFederation: '<',
    trackClick: '<',
    trackPage: '<',
  },
  template,
};
