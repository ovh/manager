import controller from './move-address.controller';
import template from './move-address.html';

export default {
  controller,
  template,
  bindings: {
    loading: '<',
    lineNumber: '<',
    portability: '<',
    address: '<',
    futureAddress: '<',
    addressLoading: '<',
    rio: '=?',
    canKeepLineNumber: '<',
    futureLineNumber: '<',
    offer: '<',
  },
};
