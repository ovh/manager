export default /* @ngInject */ function TelecomTelephonyFaxFaxConvertToVoiceFaxCtrl(
  $stateParams,
) {
  this.noService = $stateParams.serviceName === 'null';
}
