import controller from './users.controller';
import template from './users.html';

export default {
  controller,
  template,
  bindings: {
    userList: '<',
  },
};
