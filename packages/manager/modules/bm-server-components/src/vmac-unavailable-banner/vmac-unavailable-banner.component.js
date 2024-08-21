import controller from './vmac-unavailable-banner.controller';
import template from './vmac-unavailable-banner.html';

export default {
  controller,
  name: 'ovhManagerVmacUnavailableBanner',
  template,
  bindings: {
    serviceId: '<',
  },
};
