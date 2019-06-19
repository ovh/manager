import controller from './form.controller';

export default {
  name: 'signUpForm',
  controller,
  bindings: {
    action: '@',
    me: '<',
    onRulesUpdated: '&',
  },
};
