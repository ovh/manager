import controller from './billing-payments-request.controller';
import template from './billing-payments-request.html';

export default /* @ngInject */ ($stateProvider, coreConfigProvider) => {
  if (coreConfigProvider.isRegion('US')) {
    $stateProvider.state('app.account.billing.main.payments.request', {
      url: '/request',
      template,
      controller,
      controllerAs: '$ctrl',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('billing_payments_request_title'),
      },
    });
  }
};
