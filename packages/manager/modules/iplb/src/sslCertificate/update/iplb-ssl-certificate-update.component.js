import controller from './iplb-ssl-certificate-update.controller';
import template from './iplb-ssl-certificate-update.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
    ssl: '<',
  },
  controller,
  template,
};
