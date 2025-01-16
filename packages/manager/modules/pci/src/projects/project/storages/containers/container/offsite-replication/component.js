import template from './template.html';
import controller from './controller';

const component = {
  bindings: {
    isOffsiteReplicationEnabled: '<',
    onOffsiteReplicationChange: '&',
    offsiteReplicationPrice: '<',
    estimatedPrice: '<',
    priceFormatter: '<',
  },
  template,
  controller,
};

export default component;
