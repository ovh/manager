export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.hosting.dashboard.database.private-sql-activation',
    {
      url: '/private-sql-activation',
      component: 'hostingDatabasePrivateSqlActivation',
      redirectTo: (transition) =>
        Promise.all([
          transition.injector().getAsync('PrivateSql'),
          transition.injector().getAsync('hosting'),
        ]).then(([PrivateSql, hosting]) =>
          PrivateSql.getHasPrivateSqlToActivate(
            hosting,
          ).then((hasPrivateSqlToActivate) =>
            hasPrivateSqlToActivate
              ? false
              : { state: 'app.hosting.dashboard' },
          ),
        ),
      resolve: {
        me: /* @ngInject */ (user) => user,
        hosting: /* @ngInject */ ($transition$) =>
          $transition$.params().productId,
        privateSqlCatalog: /* @ngInject */ (PrivateSql, me) =>
          PrivateSql.getPrivateSqlCatalogForHosting(me.ovhSubsidiary),
        dbCategories: /* @ngInject */ (privateSqlCatalog, PrivateSql) =>
          PrivateSql.buildPrivateSqlDbCategories(privateSqlCatalog),
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
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('privatesql_activation_breadcrumb'),
      },
    },
  );
};
