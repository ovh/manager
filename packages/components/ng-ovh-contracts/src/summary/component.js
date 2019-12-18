import template from './template.html';

const component = {
  bindings: {
    contracts: '<items',
    model: '=',
    name: '@?',
  },
  template,
};

export default component;
