angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.fax.fax.customDomains', {
    url: '/customDomains',
    views: {
      'telephonyView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/fax/fax/customDomains/telecom-telephony-fax-fax-customDomains.html',
        noTranslations: true,
      },
      'faxCustomDomainsView@telecom.telephony.fax.fax.customDomains': {
        templateUrl: 'app/telecom/telephony/service/fax/customDomains/telecom-telephony-service-fax-customDomains.html',
        controller: 'TelecomTelephonyServiceFaxCustomDomainsCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['../../../service/fax/customDomains'],
  });
});
