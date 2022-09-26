import template from './template.html';

const component = {
  bindings: {
    user: '<',
    credential: '<',
    fieldSecretKeyLabel: '<',
    isNewUser: '<',
  },
  template,
};

export default component;
