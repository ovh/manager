import controller from './controller';
import template from './template.html';

const component = {
  controller,
  template,
  bindings: {
    confirmText: '<',
  },
};

export default component;
