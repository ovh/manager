import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    user: '<',
  },
  controller,
  template,
};

export default component;
