import template from './activity.html';

export default {
  name: 'ovhSignUpActivity',
  template,
  require: {
    formCtrl: '^form',
    signUpFormCtrl: '^ovhSignUpForm',
  },
};
