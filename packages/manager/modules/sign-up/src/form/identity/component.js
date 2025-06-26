import template from './identity.html';

export default {
  name: 'ovhSignUpIdentity',
  template,
  bindings: {
    onFieldBlur: '<',
  },
  require: {
    formCtrl: '^form',
    signUpFormCtrl: '^ovhSignUpForm',
    signUpIdentityCtrl: 'ovhSignUpIdentity',
  },
};
