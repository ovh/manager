export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.orders.purchases.new-purchase', {
    url: '/new-purchase',
    component: 'newPurchase',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('purchaseOrders_add_page_title'),
    },
  });
};
