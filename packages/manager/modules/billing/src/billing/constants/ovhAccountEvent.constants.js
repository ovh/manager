const moduleName = 'ovhManagerBillingConstantsOvhAccountEvents';

angular.module(moduleName, []).constant('OVH_ACCOUNT_EVENT', {
  CREDIT: 'PrepaidAccountCredit',
  TRANSFER_TO_BANK_ACCOUNT: 'PrepaidAccountTransferToBankAccount',
  ALERT: 'PrepaidAccountAlert',
});

export default moduleName;
