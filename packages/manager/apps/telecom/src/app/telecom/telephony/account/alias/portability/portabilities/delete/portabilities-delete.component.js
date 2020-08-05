import controller from './portabilities-delete.controller';
import template from './portabilities-delete.html';

export default {
  controller,
  template,
  bindings: {
    billingAccount: '<',
    portabilityId: '<',
    documentId: '<',
    goBack: '<',
  },
};
