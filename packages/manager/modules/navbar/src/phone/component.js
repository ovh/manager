import controller from './controller';
import template from './template.html';

const component = {
  controller,
  template,
  bindings: {
    user: '<',
  },
};

export default component;
