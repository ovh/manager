export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.database-selector', {
    url: '/database-selector',
    views: {
      '@app.hosting': {
        component: 'hostingDatabaseSelectorComponent',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_database_selector_breadcrumb'),
      getHostingsIceberg: /* @ngInject */ (iceberg) =>
        iceberg('/hosting/web')
          .query()
          .expand('CachedObjectList-Pages')
          .sort('displayName', 'ASC')
          .execute()
          .$promise.then(({ data }) =>
            data.map((item) => ({
              ...item,
              displayName: item.displayName || item.serviceName,
              serviceName: item.serviceName,
            })),
          ),
      goToDatabaseOrder: /* @ngInject */ ($state) => (selectedHosting) =>
        $state.go('app.hosting.dashboard.database.order-public', {
          productId: selectedHosting.serviceName,
        }),
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('getHostingsIceberg')
        .then((hostings) =>
          hostings.length === 0 ? { state: 'app.hosting.onboarding' } : false,
        ),
  });
};
