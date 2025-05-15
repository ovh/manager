import controller from './controller';
import template from './activity.html';

export default {
  name: 'ovhSignUpActivity',
  controller,
  template,
  bindings: {
    onFieldBlur: '<',
  },
  require: {
    formCtrl: '^form',
    signUpFormCtrl: '^ovhSignUpForm',
  },
};
