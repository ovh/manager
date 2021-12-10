export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.orders.purchases.edit-purchase', {
    url: '/edit-purchase',
    params: {
      purchase: null,
    },
    component: 'editPurchase',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('purchaseOrders_edit_page_title'),

      purchase: /* @ngInject */ ($transition$) =>
        $transition$.params().purchase,
    },
  });
};
