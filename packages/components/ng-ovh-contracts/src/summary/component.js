import template from './template.html';

const component = {
  bindings: {
    contracts: '<items',
    inlineContracts: '<inlineItems',
    model: '=',
    name: '@?',
  },
  template,
};

export default component;
