import template from './move-address-current.html';

export default {
  template,
  bindings: {
    address: '=?',
    addressLoading: '=?',
    portLineNumber: '=?',
    portability: '=?',
    lineNumber: '@',
  },
};
