import controller from './iplb-ssl-certificate-delete.controller';
import template from './iplb-ssl-certificate-delete.html';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
    ssl: '<',
  },
  controller,
  template,
};
