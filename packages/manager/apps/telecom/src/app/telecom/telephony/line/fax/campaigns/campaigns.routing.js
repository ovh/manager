import template from './campaigns.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.fax.campaigns', {
    url: '/campaigns',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        template,
        noTranslations: true,
      },
      'faxCampaignsView@telecom.telephony.billingAccount.line.fax.campaigns': {
        templateUrl:
          'app/telecom/telephony/service/fax/campaigns/campaigns.html',
        controller: 'TelecomTelephonyServiceFaxCampaignsCtrl',
        controllerAs: 'CampaignsCtrl',
      },
    },
  });
};
