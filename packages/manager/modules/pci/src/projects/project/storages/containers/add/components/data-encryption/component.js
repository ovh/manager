import template from './template.html';
import controller from './controller';

const component = {
  bindings: {
    encryption: '=',
  },
  template,
  controller,
};

export default component;
