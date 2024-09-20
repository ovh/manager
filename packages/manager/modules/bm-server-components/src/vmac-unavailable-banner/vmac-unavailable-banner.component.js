import controller from './vmac-unavailable-banner.controller';
import template from './vmac-unavailable-banner.html';

export default {
  controller,
  name: 'ovhManagerBmServerComponentsVmacUnavailableBanner',
  template,
  bindings: {
    serviceId: '<',
  },
};
