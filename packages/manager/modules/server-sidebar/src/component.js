import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    universe: '<',
  },
  controller,
  template,
};

export default component;
