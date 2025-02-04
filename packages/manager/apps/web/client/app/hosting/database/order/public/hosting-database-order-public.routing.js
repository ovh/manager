import component from './hosting-database-order-public.component';
import { ORDER_DATABASE_TRACKING } from './hosting-database-order-public.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.database.order-public', {
    url: '/order-public',
    component: component.name,
    params: {
      preselectDbCategory: null,
    },
    resolve: {
      catalog: /* @ngInject */ (HostingDatabase) =>
        HostingDatabase.getWebhostingCatalog(),
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

      preselectDbCategory: /* @ngInject */ ($transition$) =>
        $transition$.params().preselectDbCategory,

      dbCategories: /* @ngInject */ (
        catalog,
        webCloudCatalog,
        HostingDatabaseOrderPublicService,
        hosting,
      ) => {
        return HostingDatabaseOrderPublicService.buildDbCategories(
          catalog,
          webCloudCatalog,
          hosting.offer,
        );
      },

      user: /* @ngInject */ (coreConfig) => coreConfig.getUser(),

      webCloudCatalog: /* @ngInject */ (
        user,
        HostingDatabaseOrderPublicService,
      ) => {
        return HostingDatabaseOrderPublicService.getWebCloudCatalog(
          user.ovhSubsidiary,
        );
      },
    },
    atInternet: {
      ignore: true,
    },
    onEnter: /* @ngInject */ (atInternet) => {
      atInternet.trackPage(ORDER_DATABASE_TRACKING.PAGE);
    },
  });
};
