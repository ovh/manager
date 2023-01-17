import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    onClick: '&',
    isOpen: '<',
    universe: '<',
    namespace: '<',
  },
  controller,
  template,
};

export default component;
