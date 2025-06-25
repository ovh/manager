import template from './user-dashboard.html';
import controller from './user-dashboard.controller';

export default {
  bindings: {
    shortcuts: '<',
    supportLevel: '<',
    user: '<',
    authMethodProvider: '<',
    iamUsersLink: '<',
    onClickShortcut: '<',
  },
  template,
  controller,
};
