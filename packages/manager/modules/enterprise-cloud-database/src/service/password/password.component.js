import controller from './password.controller';
import template from './password.html';

const component = {
  template,
  bindings: {
    onChange: '&',
  },
  controller,
};

export default component;
