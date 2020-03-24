import controller from './region-selector.controller';
import template from './region-selector.html';

export default {
  template,
  controller,
  bindings: {
    regions: '<',
    onChangeHandler: '<',
  },
};
