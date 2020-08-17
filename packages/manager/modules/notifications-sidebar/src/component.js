import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    toggle: '<',
  },
  controller,
  template,
};

export default component;
