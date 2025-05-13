import template from './bank-account.html';
import controller from './bank-account.controller';

export default {
  template,
  controller,
  bindings: {
    bankAccount: '=',
    saveWalletIban: '<',
    updateIbanSuccessMessage: '=',
    svaWallet: '<',
  },
};
