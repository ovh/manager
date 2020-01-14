import controller from './iplb-ssl-certificate.controller';
import template from './iplb-ssl-certificate.html';

export default {
  bindings: {
    goBack: '<',
    goToDelete: '<',
    goToPreview: '<',
    goToUpdate: '<',
    serviceName: '<',
  },
  controller,
  template,
};
