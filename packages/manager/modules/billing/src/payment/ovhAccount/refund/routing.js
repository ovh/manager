export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.payment.ovhaccount.refund', {
    url: '/refund?accountId&movementId',
    views: {
      modal: {
        component: 'billingOvhaccountRefund',
      },
    },
    layout: 'modal',
    resolve: {
      accountId: /* @ngInject */ ($transition$) =>
        $transition$.params().accountId,
      movementId: /* @ngInject */ ($transition$) =>
        $transition$.params().movementId,
      movement: /* @ngInject */ ($http, accountId, movementId) =>
        $http
          .get(`/me/ovhAccount/${accountId}/movements/${movementId}`)
          .then(({ data }) => data),
      requestRefund: /* @ngInject */ ($http, accountId, movement) => () =>
        $http.post(
          `/me/ovhAccount/${accountId}/movements/${movement.movementId}/requestRefund`,
          {
            amount: movement.retrievableAmount.value * 100,
          },
        ),
      goBack: /* @ngInject */ (goToOvhAccount) => goToOvhAccount,
      breadcrumb: () => null,
    },
  });
};
