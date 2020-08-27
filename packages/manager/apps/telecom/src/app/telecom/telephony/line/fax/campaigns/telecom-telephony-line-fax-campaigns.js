angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.fax.campaigns',
    {
      url: '/campaigns',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl:
            'app/telecom/telephony/line/fax/campaigns/telecom-telephony-line-fax-campaigns.html',
          noTranslations: true,
        },
        'faxCampaignsView@telecom.telephony.billingAccount.line.dashboard.fax.campaigns': {
          templateUrl:
            'app/telecom/telephony/service/fax/campaigns/telecom-telephony-service-fax-campaigns.html',
          controller: 'TelecomTelephonyServiceFaxCampaignsCtrl',
          controllerAs: 'CampaignsCtrl',
        },
      },
      translations: {
        value: ['../../../service/fax/campaigns'],
        format: 'json',
      },
    },
  );
});
