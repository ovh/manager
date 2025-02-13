import template from './template.html';

const component = {
  bindings: {
    isOffsiteReplicationEnabled: '=',
    onOffsiteReplicationChange: '&',
    offsiteReplicationPrice: '<',
    estimatedPrice: '<',
    priceFormatter: '<',
  },
  template,
};

export default component;
