import template from './filtering.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.fax.filtering',
    {
      url: '/filtering',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
          noTranslations: true,
        },
        'faxFilteringView@telecom.telephony.billingAccount.line.dashboard.fax.filtering': {
          templateUrl:
            'app/telecom/telephony/service/fax/filtering/filtering.html',
          controller: 'TelecomTelephonyServiceFaxFilteringCtrl',
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_line_fax_filtering_breadcrumb'),
      },
    },
  );
};
