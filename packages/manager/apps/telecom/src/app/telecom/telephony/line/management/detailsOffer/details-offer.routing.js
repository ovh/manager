import template from './details-offer.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.detailsOffer',
    {
      url: '/detailsOffer',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
        },
        'detailsView@telecom.telephony.billingAccount.line.dashboard.detailsOffer': {
          templateUrl: 'app/telecom/telephony/line/details/details.html',
          controller: 'TelecomTelephonyLineDetailsCtrl',
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_line_details_title'),
      },
    },
  );
};
