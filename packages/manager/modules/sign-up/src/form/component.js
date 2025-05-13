import controller from './form.controller';

export default {
  name: 'ovhSignUpForm',
  controller,
  bindings: {
    action: '@',
    me: '<',
    onRulesUpdated: '&',
    model: '=',
    isValid: '=',
    smsConsent: '=',
  },
};
