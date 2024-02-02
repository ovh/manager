import component from './private-database-order-clouddb.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database-order-clouddb', {
    url: '/order-cloud-db',
    component: component.name,
    translations: { value: ['.'], format: 'json' },
    resolve: {
      assignCart: /* @ngInject */ (cartId, WucOrderCartService) =>
        WucOrderCartService.assignCart(cartId),
      cartId: /* @ngInject */ (WucOrderCartService, user) =>
        WucOrderCartService.createNewCart(user.ovhSubsidiary).then(
          ({ cartId }) => cartId,
        ),
      catalog: /* @ngInject */ (user, PrivateDatabaseOrderCloudDb) =>
        PrivateDatabaseOrderCloudDb.getCloudDBCatalog(user.ovhSubsidiary),
      datacenter: /* @ngInject */ (catalog, PrivateDatabaseOrderCloudDb) =>
        PrivateDatabaseOrderCloudDb.constructor.getOrderableDatacenter(
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
      pricings: /* @ngInject */ (catalog, PrivateDatabaseOrderCloudDb) =>
        PrivateDatabaseOrderCloudDb.constructor.getPricings(catalog.plans),
      ramSizes: /* @ngInject */ (catalog, PrivateDatabaseOrderCloudDb) =>
        PrivateDatabaseOrderCloudDb.getOrderedRamSizes(catalog.plans),
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
      onError: /* @ngInject */ ($translate, $anchorScroll) => (error) => {
        $translate.instant('private_database_order_error', {
          message: error?.data?.message,
        });
        return $anchorScroll();
      },
      onSuccess: /* @ngInject */ (
        $translate,
        $anchorScroll,
        displaySuccessMessage,
      ) => (result) => {
        const { url, autoPayWithPreferredPaymentMethod } = result;
        displaySuccessMessage(
          $translate.instant(
            `private_database_order_clouddb_bill_success_${
              autoPayWithPreferredPaymentMethod ? 'noCheckout' : 'checkout'
            }`,
            { url },
          ),
        );
        return $anchorScroll();
      },
      dbCategories: /* @ngInject */ (
        catalog,
        webCloudCatalog,
        PrivateDatabaseOrderCloudDb,
      ) => {
        return PrivateDatabaseOrderCloudDb.buildDbCategories(
          catalog,
          webCloudCatalog,
        );
      },
      user: /* @ngInject */ (coreConfig) => coreConfig.getUser(),
      webCloudCatalog: /* @ngInject */ (user, PrivateDatabaseOrderCloudDb) => {
        return PrivateDatabaseOrderCloudDb.getCloudDBCatalog(
          user.ovhSubsidiary,
        );
      },
    },
  });
};
