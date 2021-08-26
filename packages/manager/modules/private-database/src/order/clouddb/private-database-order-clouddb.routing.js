import component from './private-database-order-clouddb.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database-order-clouddb', {
    url: '/order-cloud-db',
    component: component.name,
    translations: { value: ['.'], format: 'json' },
    resolve: {
      user: /* @ngInject */ (coreConfig) => coreConfig.getUser(),
      assignCart: /* @ngInject */ (cartId, WucOrderCartService) =>
        WucOrderCartService.assignCart(cartId),
      cartId: /* @ngInject */ (WucOrderCartService, user) =>
        WucOrderCartService.createNewCart(user.ovhSubsidiary).then(
          ({ cartId }) => cartId,
        ),
      catalog: /* @ngInject */ (user, PrivateDatabaseOrderCloudDb) =>
        PrivateDatabaseOrderCloudDb.getCloudDBCatalog(user.ovhSubsidiary),
      datacenters: /* @ngInject */ (catalog, PrivateDatabaseOrderCloudDb) =>
        PrivateDatabaseOrderCloudDb.constructor.getOrderableDatacenters(
          catalog.plans,
        ),
      /* @ngInject */
      defaultPaymentMean: (ovhPaymentMethod) =>
        ovhPaymentMethod.getDefaultPaymentMethod(),
      engines: /* @ngInject */ (catalog, PrivateDatabaseOrderCloudDb) =>
        PrivateDatabaseOrderCloudDb.constructor.getOrderableEngines(
          catalog.plans,
        ),
      openBill: /* @ngInject */ ($window) => (billUrl) =>
        $window.open(billUrl, '_blank'),
      orderApiSchema: /* @ngInject */ (WucOrderCartService) =>
        WucOrderCartService.getOrderApiSchema(),
      pricings: /* @ngInject */ (catalog, PrivateDatabaseOrderCloudDb) =>
        PrivateDatabaseOrderCloudDb.constructor.getPricings(catalog.plans),
      ramSizes: /* @ngInject */ (orderApiSchema, PrivateDatabaseOrderCloudDb) =>
        PrivateDatabaseOrderCloudDb.constructor.getOrderableRamSizes(
          orderApiSchema,
        ),

      displayErrorMessage: /* @ngInject */ ($timeout, Alerter) => (
        errorMessage,
      ) =>
        $timeout(() => {
          Alerter.error(errorMessage, 'cloudDB_order_alert');
        }),
      displaySuccessMessage: /* @ngInject */ ($timeout, Alerter) => (message) =>
        $timeout(() => {
          Alerter.success(message, 'cloudDB_order_alert');
        }),
      hideBreadcrumb: () => true,
    },
  });
};
