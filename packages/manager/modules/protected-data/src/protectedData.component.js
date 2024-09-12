import controller from './protectedData.controller';
import template from './protectedData.html';

export default {
  bindings: {
    isHidden: '<',
  },
  controller,
  template,
  transclude: true,
};
