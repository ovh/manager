import template from './billing-corrective-invoices.html';

export default /* @ngInject */ ($stateProvider) => {
  const name = 'billing.main.corrective-invoices';

  $stateProvider.state(name, {
    url: '/corrective-invoices',
    template,
    controller: 'BillingCorrectiveInvoicesController',
    controllerAs: '$ctrl',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('currentUser')
        .then((currentUser) =>
          currentUser.ovhSubsidiary !== 'PL' ? 'billing.main.refunds' : false,
        ),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('billing_payment_corrective_invoices'),
    },
  });
};
