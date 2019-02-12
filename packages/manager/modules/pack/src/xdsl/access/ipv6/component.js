import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    routingIpv6: '<',
    ipv6Enabled: '<',
    isZyxel: '<',
  },
  controller,
  template,
};
