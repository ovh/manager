import controller from './move-address-future.controller';
import template from './move-address-future.html';

export default {
  controller,
  template,
  bindings: {
    address: '=?',
    addressLoading: '=?',
    rio: '=?',
    keepLineNumber: '=?',
    lineNumber: '@',
    canKeepLineNumber: '=?',
  },
};
