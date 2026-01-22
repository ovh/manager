import template from './number-choice.html';
import controller from './number-choice.controller';

export default {
  template,
  controller,
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
