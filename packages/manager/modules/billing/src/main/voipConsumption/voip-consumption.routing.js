export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('billing.main.voip-consumption', {
    url: `/voip-consumption`,
    component: 'billingVoipConsumptionComponent',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('voip_consumption_page_title'),
    },
  });
};
