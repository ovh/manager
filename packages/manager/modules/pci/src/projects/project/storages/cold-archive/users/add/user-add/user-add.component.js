import controller from './user-add.controller';
import template from './user-add.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    goBack: '<',
    userList: '<',
    allUserList: '<',
    cancel: '<',
    usersWithCredentials: '<',
    trackClick: '<',
    trackPage: '<',
  },
};
