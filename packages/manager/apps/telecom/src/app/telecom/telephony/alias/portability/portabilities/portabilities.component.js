import controller from './portabilities.controller';
import template from './portabilities.html';

export default {
  bindings: {
    backToAdministrationGroup: '<',
    billingAccount: '<',
    portabilityId: '<',
    attachMandate: '<',
    deleteDocument: '<',
    documentId: '<',
    goToCancelPortability: '<',
    goToRelaunchPortability: '<',
    serviceName: '<',
  },
  controller,
  template,
};
