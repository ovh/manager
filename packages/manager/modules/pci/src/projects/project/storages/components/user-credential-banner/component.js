import template from './template.html';

export default {
  bindings: {
    user: '<',
    credential: '<',
    fieldSecretKeyLabel: '@',
  },
  template,
};
