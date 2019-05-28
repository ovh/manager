import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    onClick: '&',
    isOpen: '<',
    universe: '<',
  },
  controller,
  template,
};

export default component;
