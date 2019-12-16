import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import toLower from 'lodash/toLower';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.private-sql-activation', {
    url: '/private-sql-activation',
    component: 'privateSqlActivation',
    resolve: {
      me: /* @ngInject */ User => User.getUser(),
      hosting: /* @ngInject */ $transition$ => $transition$.params().productId,
      availability: /* @ngInject */
        (Hosting, HostingDatabase, hosting) => HostingDatabase
          .getPrivateDatabaseCapabilities(hosting)
          .then(capabilities => Hosting
            .getPrivateDatabasesLinked(hosting)
            .then(privateDbs => privateDbs.length < capabilities.length)),
      services: /* @ngInject */ OvhApiHostingWeb => OvhApiHostingWeb.v6().query().$promise
        .then(services => sortBy(services, serviceName => toLower(serviceName))),
      versions: /* @ngInject */ (PrivateDatabase, $translate) => PrivateDatabase
        .getAvailableOrderCapacities('classic')
        .then(({ version }) => map(version, v => ({
          id: v,
          label: $translate.instant(`privatesql_activation_version_v_${v.replace('.', '')}`),
        }))),
    },
  });
};
