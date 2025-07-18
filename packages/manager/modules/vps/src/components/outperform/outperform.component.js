import controller from './outperform.controller';
import template from './outperform.html';

export default {
  bindings: {
    vpsName: '<?',
    goBack: '<',
  },
  controller,
  template,
};
