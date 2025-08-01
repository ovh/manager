import controller from './vps-outperform-banner.controller';
import template from './vps-outperform-banner.html';

export default {
  bindings: {
    serviceName: '<',
  },
  controller,
  name: 'ovhManagerBillingVpsOutperformBanner',
  template,
};
