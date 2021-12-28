import controller from './controller';
import template from './template.html';

import './style.scss';

export default {
  bindings: {
    displayAlerterMessage: '<',
    goBack: '<',
    orderPublicIpHitTracking: '<',
    serviceName: '<',
    trackClick: '<',
    trackingPrefix: '<',
  },
  controller,
  template,
};
