const moduleName = 'ovhManagerBillingConstantsAutorenewEvents';

angular.module(moduleName, []).constant('AUTORENEW_EVENT', {
  TERMINATE_AT_EXPIRATION: 'ServiceTerminateAtExpiration',
  TERMINATE: 'ServiceTerminate',
  CANCEL_TERMINATE: 'ServiceCancelTerminate',
  ACTIVATE_AUTO_PAYMENT: 'ServiceActivateAutomaticPayment',
  DEACTIVATE_AUTO_PAYMENT: 'ServiceDeactivateAutomaticPayment',
  MODIFY: 'ServiceModify',
  PAY: 'ServicePay',
  DISABLE_AUTOMATIC_PAYMENT_FOR_DOMAINS: 'DisableAutomaticPaymentForDomains',
});

export default moduleName;
