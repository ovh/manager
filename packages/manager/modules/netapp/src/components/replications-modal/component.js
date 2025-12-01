import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    modalType: '<',
    onPrimaryClick: '<',
    isPrimaryDisabled: '<',
  },
  controller,
  template,
};
