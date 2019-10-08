import controller from './rule.controller';
import template from './rule.html';

const component = {
  template,
  bindings: {
    label: '<',
    onChange: '&',
  },
  controller,
};

export default component;
