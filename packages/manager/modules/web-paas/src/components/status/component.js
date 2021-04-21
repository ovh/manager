import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    project: '<',
    userList: '<',
  },
  controller,
  template,
};
