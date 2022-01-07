import controller from './upgrade.controller';
import template from './upgrade.html';

export default {
  template,
  controller,
  bindings: {
    datacenterId: '<',
    goBack: '<',
    id: '<',
    productId: '<',
    type: '<',
    trackClick: '<',
    trackPage: '<',
  },
  name: 'ovhManagerPccResourceUpgrade',
};
