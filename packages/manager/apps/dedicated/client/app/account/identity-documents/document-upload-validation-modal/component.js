import template from './template.html';

export default {
  template,
  bindings: {
    onClose: '&',
    isOpenModal: '<',
  },
};
