import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import toLower from 'lodash/toLower';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.database.private-sql-activation', {
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
          hasPrivateSqlToActivate ? false : { state: 'app.hosting' },
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
      services: /* @ngInject */ (OvhApiHostingWeb) =>
        OvhApiHostingWeb.v6()
          .query()
          .$promise.then((services) =>
            orderBy(services, (serviceName) => toLower(serviceName)),
          ),
      versions: /* @ngInject */ (PrivateDatabase) =>
        PrivateDatabase.getOrderableDatabaseVersions('classic'),
    },
  });
};
