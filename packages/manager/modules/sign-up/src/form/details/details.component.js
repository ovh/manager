import controller from './details.controller';
import template from './details.html';

export default {
  name: 'ovhSignUpDetails',
  controller,
  bindings: {
    onFieldError: '<',
  },
  template,
  require: {
    formCtrl: '^form',
    signUpFormCtrl: '^ovhSignUpForm',
    signUpDetailsCtrl: 'ovhSignUpDetails',
  },
};
