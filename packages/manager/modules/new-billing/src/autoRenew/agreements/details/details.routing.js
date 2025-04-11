export default /* @ngInject */ (
  $stateProvider,
  $urlServiceProvider,
  coreConfigProvider,
) => {
  if (coreConfigProvider.isRegion(['EU', 'CA'])) {
    $stateProvider.state('billing.autorenew.agreements.agreement', {
      url: '/details/{id:int}',
      component: 'userAgreementsDetails',
      resolve: {
        agreementId: /* @ngInject */ ($transition$) => $transition$.params().id,
        breadcrumb: /* @ngInject */ (agreementId) => agreementId.toString(),
      },
    });

    // ensure compatibility with links sended by emails
    // like #/useraccount/agreements or #/useraccount/agreements/123456/details
    // make a redirect to the new url of ui route
    $urlServiceProvider.rules.when(
      '/useraccount/agreements/:id/details',
      '/billing/agreements/details/:id',
    );
  }
};
