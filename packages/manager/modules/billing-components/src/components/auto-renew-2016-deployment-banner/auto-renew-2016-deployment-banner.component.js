import controller from './auto-renew-2016-deployment-banner.controller';
import template from './auto-renew-2016-deployment-banner.html';

export default {
  bindings: {
    show: '<',
  },
  controller,
  name: 'ovhManagerAutoRenew2016DeploymentBanner',
  template,
};
