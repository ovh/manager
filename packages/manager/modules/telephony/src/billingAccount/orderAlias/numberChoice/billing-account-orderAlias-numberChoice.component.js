import template from './billing-account-orderAlias-numberChoice.html';

export default {
  template,
  bindings: {
    ngModel: '=?',
    choices: '=?',
    prices: '=?',
    ngDisabled: '=?',
    type: '@',
    billingAccount: '@',
    name: '@',
  },
};
