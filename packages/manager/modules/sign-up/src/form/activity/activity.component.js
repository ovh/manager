import controller from './controller';
import template from './activity.html';

export default {
  name: 'ovhSignUpActivity',
  controller,
  template,
  bindings: {
    onFieldError: '<',
  },
  require: {
    formCtrl: '^form',
    signUpFormCtrl: '^ovhSignUpForm',
  },
};
