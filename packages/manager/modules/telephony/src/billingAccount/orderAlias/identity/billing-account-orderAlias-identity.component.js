import template from './billing-account-orderAlias-identity.html';

export default {
  template,
  bindings: {
    ngModel: '=?',
    ngDisabled: '=?',
    organisation: '@',
  },
  controller(tucValidator) {
    this.validator = tucValidator;
  },
};
