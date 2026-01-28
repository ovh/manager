import controller from './billing-main.controller';
import template from './billing-main.html';

export default /* @ngInject */ ($stateProvider, $urlServiceProvider) => {
  $stateProvider.state('billing.main', {
    url: '',
    template,
    controller,
    controllerAs: '$ctrl',
    redirectTo: 'billing.main.history',
    resolve: {
      checkFeatureAvailability: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping.checkFeatureAvailability([
          'billing:payAsYouGo',
          'telephony',
        ]),
      isPayAsYouGoAvailable: /* @ngInject */ (checkFeatureAvailability) => checkFeatureAvailability.isFeatureAvailable('billing:payAsYouGo'),
      isTelephonyAvailable: /* @ngInject */ (checkFeatureAvailability) => checkFeatureAvailability.isFeatureAvailable('telephony'),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_main_title'),
      isPolandAccount: /* @ngInject */ (currentUser) =>
        currentUser.ovhSubsidiary === 'PL',
    },
  });

  $urlServiceProvider.rules.when(
    '/billing/payment/refunds',
    '/billing/refunds',
  );
};
