import template from './template.html';

const component = {
  bindings: {
    contracts: '<items',
    inlineContracts: '<inlineItems',
    model: '=',
    name: '@?',
    trackingPrefix: '<',
  },
  template,
};

export default component;
