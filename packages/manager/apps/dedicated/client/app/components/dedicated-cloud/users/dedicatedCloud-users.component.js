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
    hasNsxOption: '<',
    passwordReset: '<',
    productId: '<',
    setMessage: '<',
    goToUserIamRole: '<',
    goToImportUser: '<',
    goToToggleIam: '<',
    goToAddFederation: '<',
    goToDeleteFederation: '<',
    goToEditFederation: '<',
    trackClick: '<',
    trackPage: '<',
  },
  template,
};
