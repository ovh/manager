export default /* @ngInject */ function XdslAccessNotificationCtrl(
  $stateParams,
  TucToastError,
) {
  this.xdslId = $stateParams.serviceName;
  this.displayError = TucToastError;
}
