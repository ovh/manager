export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.order', {
    url: '/order',
    component: 'privateDatabaseOrderPrivateSQL',
    resolve: {
      autoPayWithPreferredPaymentMethod: /* @ngInject */ (ovhPaymentMethod) =>
        ovhPaymentMethod.hasDefaultPaymentMethod(),

      hideBreadcrumb: () => true,
      user: /* @ngInject */ (coreConfig) => coreConfig.getUser(),
    },
  });
};
