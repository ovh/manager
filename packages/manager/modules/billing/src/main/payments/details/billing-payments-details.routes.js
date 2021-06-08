import controller from './billing-payments-details.controller';
import template from './billing-payments-details.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.main.payments.payment', {
    url: '/:id',
    template: '<div ui-view></div>',
    redirectTo: 'app.account.billing.main.payments.payment.details',
    resolve: {
      paymentId: /* @ngInject */ ($transition$) => $transition$.params().id,
      breadcrumb: /* @ngInject */ (paymentId) => paymentId,
    },
  });

  $stateProvider.state('app.account.billing.main.payments.payment.details', {
    url: '/details',
    template,
    controller,
    controllerAs: '$ctrl',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
