import controller from './activity.controller';
import template from './activity.html';

export default {
  name: 'signUpActivity',
  controller,
  template,
  require: {
    formCtrl: '^form',
    signUpFormCtrl: '^signUpForm',
  },
};
