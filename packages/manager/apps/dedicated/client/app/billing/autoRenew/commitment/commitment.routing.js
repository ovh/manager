export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.service.commitment', {
    url: '/commitment?duration',
    component: 'billingCommitment',
    resolve: {
      goBack: /* @ngInject */ (goToAutorenew) => goToAutorenew,
      duration: /* @ngInject */ ($transition$) =>
        $transition$.params().duration,
      me: /* @ngInject */ (currentUser) => currentUser,
    },
  });
};
