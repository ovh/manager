import filter from 'lodash/filter';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.hosting.dashboard.database.private-sql-activation',
    {
      url: '/private-sql-activation',
      component: 'hostingDatabasePrivateSqlActivation',
      redirectTo: (transition) =>
        Promise.all([
          transition.injector().getAsync('HostingDatabase'),
          transition.injector().getAsync('hosting'),
        ]).then(([HostingDatabase, hosting]) =>
          HostingDatabase.getHasPrivateSqlToActivate(
            hosting,
          ).then((hasPrivateSqlToActivate) =>
            hasPrivateSqlToActivate
              ? false
              : { state: 'app.hosting.dashboard' },
          ),
        ),
      resolve: {
        catalog: /* @ngInject */ (HostingDatabase) =>
          HostingDatabase.getWebhostingCatalog(),
        me: /* @ngInject */ (user) => user,
        hosting: /* @ngInject */ ($transition$) =>
          $transition$.params().productId,
        privateSqlOptions: /* @ngInject */ (availableOptions) =>
          filter(availableOptions, (option) =>
            option.planCode.startsWith('private-sql'),
          ),
        versions: /* @ngInject */ (PrivateDatabase) =>
          PrivateDatabase.getOrderableDatabaseVersions('classic'),
        datacenter: /* @ngInject */ (serviceName, getDatacenter) =>
          getDatacenter(serviceName),
        getDatacenter: /* @ngInject */ (Hosting) => async (serviceName) => {
          const { datacenter } = await Hosting.getHosting(serviceName);
          return datacenter;
        },

        onError: /* @ngInject */ ($translate, goToHosting) => (error) =>
          goToHosting(
            $translate.instant('privatesql_activation_hosting_error', {
              message: error.data.message,
            }),
            'danger',
            'app.alerts.database',
          ),
        onSuccess: /* @ngInject */ ($translate, goToHosting) => (
          checkoutResult,
        ) =>
          goToHosting(
            $translate.instant(
              checkoutResult.autoPayWithPreferredPaymentMethod
                ? 'privatesql_activation_success'
                : 'privatesql_activation_success_bc',
              {
                url: checkoutResult.url,
              },
            ),
            'success',
            'app.alerts.database',
          ),
      },
    },
  );
};
