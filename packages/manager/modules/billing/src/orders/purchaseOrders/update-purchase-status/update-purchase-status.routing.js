export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.account.billing.orders.purchases.update-purchase-status',
    {
      url: '/update-purchase-status',
      params: {
        purchase: null,
      },
      views: {
        modal: {
          component: 'updatePurchaseStatus',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: /* @ngInject */ () => null,

        purchase: /* @ngInject */ ($transition$) =>
          $transition$.params().purchase,
      },
    },
  );
};
