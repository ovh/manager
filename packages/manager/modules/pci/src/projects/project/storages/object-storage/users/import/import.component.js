import controller from './import.controller';
import template from './import.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    userList: '<',
    userId: '<',
    user: '<',
    goBack: '<',
  },
};
