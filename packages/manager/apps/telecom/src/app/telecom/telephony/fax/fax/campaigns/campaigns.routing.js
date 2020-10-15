import template from './campaigns.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.fax.fax.campaigns', {
    url: '/campaigns',
    views: {
      'telephonyView@telecom.telephony': {
        template,
        noTranslations: true,
      },
      'faxCampaignsView@telecom.telephony.billingAccount.fax.fax.campaigns': {
        templateUrl:
          'app/telecom/telephony/service/fax/campaigns/campaigns.html',
        controller: 'TelecomTelephonyServiceFaxCampaignsCtrl',
        controllerAs: 'CampaignsCtrl',
      },
    },
  });
};
