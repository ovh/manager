import controller from './privacy-selector.controller';
import template from './privacy-selector.html';

export default {
  template,
  controller,
  bindings: {
    onChangeHandler: '<',
    selectedPrivacy: '<',
  },
};
