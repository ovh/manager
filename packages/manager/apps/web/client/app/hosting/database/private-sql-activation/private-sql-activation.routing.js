import head from 'lodash/head';
import map from 'lodash/map';
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
      services: /* @ngInject */ (OvhApiHostingWeb) =>
        OvhApiHostingWeb.v6()
          .query()
          .$promise.then((services) =>
            orderBy(services, (serviceName) => toLower(serviceName)),
          ),
      versions: /* @ngInject */ ($translate, PrivateDatabase) =>
        PrivateDatabase.getAvailableOrderCapacities('classic')
          .then(({ version }) =>
            map(version, (v) => ({
              id: v,
              label: $translate.instant(
                `privatesql_activation_version_v_${v.replace('.', '')}`,
              ),
            })),
          )
          .then((versions) => {
            return orderBy(
              versions,
              [
                ({ id }) => {
                  return head(id.split('_'));
                },
                ({ id }) => {
                  const [, version] = id.split('_');
                  return parseFloat(version);
                },
              ],
              ['asc', 'desc'],
            );
          }),
    },
  });
};
