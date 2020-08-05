angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.fax.dashboard.fax.campaigns',
      {
        url: '/campaigns',
        views: {
          'telephonyView@telecom.telephony': {
            templateUrl:
              'app/telecom/telephony/fax/fax/campaigns/telecom-telephony-fax-fax-campaigns.html',
            noTranslations: true,
          },
          'faxCampaignsView@telecom.telephony.billingAccount.fax.dashboard.fax.campaigns': {
            templateUrl:
              'app/telecom/telephony/service/fax/campaigns/telecom-telephony-service-fax-campaigns.html',
            controller: 'TelecomTelephonyServiceFaxCampaignsCtrl',
            controllerAs: 'CampaignsCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_fax_fax_campaigns_breadcrumb'),
        },
        translations: {
          value: ['../../../service/fax/campaigns'],
          format: 'json',
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
