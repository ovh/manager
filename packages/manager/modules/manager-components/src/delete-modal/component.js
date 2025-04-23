import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    serviceType: '<',
    description: '<',
    isOpenModal: '<',
    onClose: '@',
    onConfirm: '@',
  },
  template,
  controller,
};
