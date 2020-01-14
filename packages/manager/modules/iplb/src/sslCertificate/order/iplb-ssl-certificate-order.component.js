import controller from './iplb-ssl-certificate-order.controller';
import template from './iplb-ssl-certificate-order.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
  },
  controller,
  template,
};
