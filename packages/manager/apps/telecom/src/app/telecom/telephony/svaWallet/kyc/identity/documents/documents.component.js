import template from './documents.html';
import controller from './documents.controller';

export default {
  template,
  controller,
  bindings: {
    documentTypeEnum: '<',
    documentNatureEnum: '<',
    svaWallet: '<',
    uploadDocument: '<',
    goToBillingAccount: '<',
  },
};
