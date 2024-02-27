import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    installation: '=',
    optionForm: '<',
    inputRules: '<',
  },
  controller,
  template,
};
