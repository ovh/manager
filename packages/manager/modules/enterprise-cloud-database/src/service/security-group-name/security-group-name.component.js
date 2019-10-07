import controller from './security-group-name.controller';
import template from './security-group-name.html';

const component = {
  template,
  bindings: {
    label: '<',
    onChange: '&',
    value: '<',
  },
  controller,
};

export default component;
