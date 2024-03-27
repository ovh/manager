import template from './template.html';

const component = {
  bindings: {
    contracts: '<items',
    inlineContracts: '<inlineItems',
    model: '=',
    name: '@?',
    disabled: '<?',
    trackingPrefix: '<',
  },
  template,
};

export default component;
