export default /* @ngInject */ ($stateProvider, $urlServiceProvider) => {
  $stateProvider.state('billing.autorenew.agreements.agreement', {
    url: '/details/{id:int}',
    component: 'userAgreementsDetails',

    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('isAgreementsAvailable')
        .then(
          (isAgreementsAvailable) =>
            !isAgreementsAvailable && 'billing.autorenew',
        ),
    resolve: {
      agreementId: /* @ngInject */ ($transition$) => $transition$.params().id,
      breadcrumb: /* @ngInject */ (agreementId) => agreementId.toString(),
      hideBreadcrumb: /* @ngInject */ (isAutorenewManagementAvailable) =>
        !isAutorenewManagementAvailable,
    },
  });

  // ensure compatibility with links sended by emails
  // like #/useraccount/agreements or #/useraccount/agreements/123456/details
  // make a redirect to the new url of ui route
  $urlServiceProvider.rules.when(
    '/useraccount/agreements/:id/details',
    '/billing/agreements/details/:id',
  );
};