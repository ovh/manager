angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.fax.assist', {
    url: '/assist',
    views: {
      faxInnerView: {
        templateUrl: 'app/telecom/telephony/fax/assist/telecom-telephony-fax-assist.html',
        controller: 'TelecomTelephonyFaxAssistCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.', '../../service/assist'],
  });
});
