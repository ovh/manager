import controller from './controller';
import template from './activity.html';

export default {
  name: 'ovhSignUpActivity',
  controller,
  template,
  require: {
    formCtrl: '^form',
    signUpFormCtrl: '^ovhSignUpForm',
  },
};
