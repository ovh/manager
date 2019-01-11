angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.fax.fax.campaigns', {
    url: '/campaigns',
    views: {
      'telephonyView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/fax/fax/campaigns/telecom-telephony-fax-fax-campaigns.html',
        noTranslations: true,
      },
      'faxCampaignsView@telecom.telephony.fax.fax.campaigns': {
        templateUrl: 'app/telecom/telephony/service/fax/campaigns/telecom-telephony-service-fax-campaigns.html',
        controller: 'TelecomTelephonyServiceFaxCampaignsCtrl',
        controllerAs: 'CampaignsCtrl',
      },
    },
    translations: ['../../../service/fax/campaigns'],
  });
});
