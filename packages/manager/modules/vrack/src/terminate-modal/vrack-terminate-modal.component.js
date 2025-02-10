import controller from './vrack-terminate-modal.controller';
import template from './vrack-terminate-modal.html';

export default {
  bindings: {
    onConfirm: '&',
    onCancel: '&',
    isOpenModal: '<',
  },
  controller,
  template,
};
