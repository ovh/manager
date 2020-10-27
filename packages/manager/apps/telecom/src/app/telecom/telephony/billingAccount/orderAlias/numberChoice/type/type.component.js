import template from './type.html';

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
