import template from './template.html';
import controller from './controller';

const component = {
  bindings: {
    fieldSecretKeyLabel: '<',
    fieldSecretKeyValue: '<',
  },
  template,
  controller,
};

export default component;
