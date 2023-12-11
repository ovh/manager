import controller from './introduction.controller';
import template from './introduction.html';

export default {
  bindings: {
    goBack: '<',
    goToManage: '<',
    user: '<',
  },
  controller,
  template,
};
