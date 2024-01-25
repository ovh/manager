import template from './template.html';
import controller from './controller';

const component = {
  bindings: {
    contracts: '<items',
    inlineContracts: '<inlineItems',
    model: '=',
    name: '@?',
    trackingPrefix: '<',
  },
  template,
  controller,
};

export default component;
