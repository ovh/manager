import template from './template.html';

export default {
  template,
  bindings: {
    onCancel: '&',
    onConfirm: '&',
    isOpenModal: '<',
  },
};
