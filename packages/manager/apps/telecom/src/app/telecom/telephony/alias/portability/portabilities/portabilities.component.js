import controller from './portabilities.controller';
import template from './portabilities.html';

export default {
  bindings: {
    billingAccount: '<',
    portabilityId: '<',
    attachMandate: '<',
    deleteDocument: '<',
    documentId: '<',
    serviceName: '<',
  },
  controller,
  template,
};
