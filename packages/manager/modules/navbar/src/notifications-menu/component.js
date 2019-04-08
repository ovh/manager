import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    subsidiary: '@',
  },
  controller,
  template,
};

export default component;
