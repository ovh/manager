import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    catalog: '<',
    regionAvailability: '<',
    onGatewaySizeSelection: '&',
  },
  controller,
  template,
};
