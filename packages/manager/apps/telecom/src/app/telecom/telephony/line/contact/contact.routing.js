export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.line.dashboard.contact',
    {
      url: '/contact',
      views: {
        'lineInnerView@telecom.telephony.billingAccount.line.dashboard': {
          templateUrl: 'app/telecom/telephony/service/contact/contact.html',
          controller: 'TelecomTelephonyServiceContactCtrl',
          controllerAs: '$ctrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_line_contact_breadcrumb'),
      },
    },
  );
};
