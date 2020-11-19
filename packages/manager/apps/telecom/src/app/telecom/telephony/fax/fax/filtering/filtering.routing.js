import template from './filtering.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.fax.filtering',
    {
      url: '/filtering',
      views: {
        'telephonyView@telecom.telephony': {
          template,
          noTranslations: true,
        },
        'faxFilteringView@telecom.telephony.billingAccount.fax.dashboard.fax.filtering': {
          templateUrl:
            'app/telecom/telephony/service/fax/filtering/filtering.html',
          controller: 'TelecomTelephonyServiceFaxFilteringCtrl',
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_fax_fax_filtering_breadcrumb'),
      },
    },
  );
};
