import component from './hosting-database-order-public.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.database.order-public', {
    url: '/order-public',
    component: component.name,
    resolve: {
      catalog: /* @ngInject */ (HostingDatabase) =>
        HostingDatabase.getWebhostingCatalog(),
      characteristicsOfAvailableProducts: /* @ngInject */ (
        HostingDatabaseOrderPublicService,
        serviceName,
      ) =>
        HostingDatabaseOrderPublicService.getCharacteristicsOfAvailableProducts(
          serviceName,
        ),
      goBack: /* @ngInject */ (goToDatabase) => goToDatabase,
      hosting: /* @ngInject */ (Hosting, serviceName) =>
        Hosting.getSelected(serviceName, true),
      onError: /* @ngInject */ ($translate, goBack) => (error) =>
        goBack(
          $translate.instant('ovhManagerHostingDatabaseOrderPublic_error', {
            message: error.data.message,
          }),
          'danger',
          'app.alerts.database',
        ),
      onSuccess: /* @ngInject */ ($translate, goBack) => (checkoutResult) =>
        goBack(
          $translate.instant(
            checkoutResult.autoPayWithPreferredPaymentMethod
              ? 'ovhManagerHostingDatabaseOrderPublic_success_noCheckout'
              : 'ovhManagerHostingDatabaseOrderPublic_success_checkout',
            {
              url: checkoutResult.url,
            },
          ),
          'success',
          'app.alerts.database',
        ),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('ovhManagerHostingDatabaseOrderPublic_title'),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
    },
  });
};
