import template from './campaigns.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.fax.campaigns',
    {
      url: '/campaigns',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          noTranslations: true,
        },
        'faxCampaignsView@telecom.telephony.billingAccount.line.dashboard.fax.campaigns': {
          templateUrl:
            'app/telecom/telephony/service/fax/campaigns/campaigns.html',
          controller: 'TelecomTelephonyServiceFaxCampaignsCtrl',
          controllerAs: 'CampaignsCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_line_fax_campaigns_breadcrumb'),
      },
    },
  );
};
