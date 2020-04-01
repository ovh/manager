import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    onClick: '&?',
    user: '<',
  },
  controller,
  template,
};

export default component;
