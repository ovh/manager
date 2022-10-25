import controller from './import.controller';
import template from './import.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    projectId: '<',
    trackingPrefix: '<',
    userList: '<',
    userId: '<',
    user: '<',
  },
};
