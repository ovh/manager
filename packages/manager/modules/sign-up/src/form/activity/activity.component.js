import template from './activity.html';

export default {
  name: 'signUpActivity',
  template,
  require: {
    formCtrl: '^form',
    signUpFormCtrl: '^signUpForm',
  },
};
