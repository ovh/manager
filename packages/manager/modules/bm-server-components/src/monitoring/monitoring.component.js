import controller from './monitoring.controller';
import template from './monitoring.html';

export default {
  bindings: {
    goBack: '<',
    serverType: '<?',
  },
  controller,
  template,
};
