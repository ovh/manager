import template from './billing-account-orderAlias-numberChoice-type.html';

export default {
  template,
  bindings: {
    loading: '=?',
    radioModel: '=?',
    numberModel: '=?',
    radioValue: '@',
    title: '@',
    price: '@',
    choices: '=?',
    ngDisabled: '=?',
    name: '@',
  },
};
