import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import toLower from 'lodash/toLower';

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
        me: /* @ngInject */ (user) => user,
        hosting: /* @ngInject */ ($transition$) =>
          $transition$.params().productId,
        privateSqlOptions: /* @ngInject */ (availableOptions) =>
          filter(availableOptions, (option) =>
            option.planCode.startsWith('private-sql'),
          ),
        versions: /* @ngInject */ (PrivateDatabase) =>
          PrivateDatabase.getOrderableDatabaseVersions('classic'),
        services: /* @ngInject */ (OvhApiHostingWeb) =>
          OvhApiHostingWeb.v6()
            .query()
            .$promise.then((services) =>
              orderBy(services, (serviceName) => toLower(serviceName)),
            ),
      },
    },
  );
};
