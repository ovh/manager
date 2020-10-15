import template from './number-choice.html';

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
