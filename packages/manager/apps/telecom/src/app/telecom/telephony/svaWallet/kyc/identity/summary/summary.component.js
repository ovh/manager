import template from './summary.html';
import controller from './summary.controller';

export default {
  template,
  controller,
  bindings: {
    svaWallet: '<',
    bankAccount: '<',
    saveWalletIban: '<',
    documentTypeEnum: '<',
    documentNatureEnum: '<',
    uploadDocument: '<',
  },
};
