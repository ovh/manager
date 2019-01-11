angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.fax.management.informations', {
    url: '/informations',
    views: {
      'faxView@telecom.telephony.fax': {
        templateUrl: 'app/telecom/telephony/fax/management/informations/telecom-telephony-fax-management-informations.html',
        controller: 'TelecomTelephonyFaxManagementInformationsCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
