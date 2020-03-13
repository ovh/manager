import template from './template.html';

const component = {
  bindings: {
    onSublinkClick: '&',
    sublinks: '<',
  },
  template,
};

export default component;
