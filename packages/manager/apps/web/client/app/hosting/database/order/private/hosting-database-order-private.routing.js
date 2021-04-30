export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.database.order-private', {
    url: '/order-private',
    component: 'hostingDatabaseOrderPrivate',
    resolve: {
      /* @ngInject */
      autoPayWithPreferredPaymentMethod: (ovhPaymentMethod) =>
        ovhPaymentMethod.hasDefaultPaymentMethod(),

      datacenter: /* @ngInject */ (serviceName, getDatacenter) =>
        getDatacenter(serviceName),

      getDatacenter: /* @ngInject */ (Hosting) => async (serviceName) => {
        const { datacenter } = await Hosting.getHosting(serviceName);
        return datacenter;
      },

      /* @ngInject */
      defaultPaymentMean: (ovhPaymentMethod) =>
        ovhPaymentMethod.getDefaultPaymentMethod(),

      goBack: /* @ngInject */ (goToDatabase) => goToDatabase,

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_database_order_private_title'),
    },
  });
};
