import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    subsidiary: '@?',
    universe: '@?',
  },
  controller,
  template,
};

export default component;
