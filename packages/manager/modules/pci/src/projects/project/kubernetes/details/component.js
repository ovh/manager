import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    cluster: '<',
  },
  template,
  controller,
};

export default component;
