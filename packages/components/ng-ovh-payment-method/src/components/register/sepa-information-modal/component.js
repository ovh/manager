import template from './template.html';

export default {
  template,
  bindings: {
    onConfirm: '&',
    isModalOpened: '<',
  },
};
