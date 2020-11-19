import template from './details.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.phone.details',
    {
      url: '/details',
      views: {
        'lineView@telecom.telephony.billingAccount.line.dashboard': {
          template,
        },
        'detailsView@telecom.telephony.billingAccount.line.dashboard.phone.details': {
          templateUrl: 'app/telecom/telephony/line/details/details.html',
          controller: 'TelecomTelephonyLineDetailsCtrl',
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_line_phone_informations_title'),
      },
    },
  );
};
