import controller from './details.controller';
import template from './details.html';

export default {
  name: 'signUpDetails',
  controller,
  template,
  require: {
    formCtrl: '^form',
    signUpFormCtrl: '^signUpForm',
  },
};
