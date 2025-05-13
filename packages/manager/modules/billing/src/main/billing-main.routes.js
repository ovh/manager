import controller from './billing-main.controller';
import template from './billing-main.html';

export default /* @ngInject */ ($stateProvider, $urlServiceProvider) => {
  $stateProvider.state('app.account.billing.main', {
    url: '',
    template,
    controller,
    controllerAs: '$ctrl',
    redirectTo: 'app.account.billing.main.history',
    resolve: {
      isPayAsYouGoAvailable: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability(['billing:payAsYouGo'])
          .then((commitmentAvailability) =>
            commitmentAvailability.isFeatureAvailable('billing:payAsYouGo'),
          )
          .catch(() => false),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_main_title'),
    },
  });

  $urlServiceProvider.rules.when(
    '/billing/payment/refunds',
    '/billing/refunds',
  );
};
