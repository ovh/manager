import controller from './introduction.controller';
import template from './introduction.html';

export default {
  bindings: {
    goBack: '<',
    goToManage: '<',
    user: '<',
    serverIsNode: '<?',
  },
  controller,
  template,
};
