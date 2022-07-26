import template from './template.html';

const component = {
  bindings: {
    user: '<',
    credential: '<',
    fieldSecretKeyLabel: '<',
  },
  template,
};

export default component;
