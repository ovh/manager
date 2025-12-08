import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceType: '@',
    description: '@',
    isOpenModal: '<',
    onClose: '&',
    onConfirm: '&',
    primaryDisabled: '<',
    loading: '<',
  },
  transclude: true,
  controller,
  template,
};
