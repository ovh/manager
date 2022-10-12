export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard.newPricing', {
    url: 'new-prices',
    component: 'hubNewPrices',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('manager_hub_new_pricing_breadcrumb'),
    },
  });
};
