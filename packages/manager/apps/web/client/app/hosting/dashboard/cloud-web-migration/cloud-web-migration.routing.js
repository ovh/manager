import { CLOUD_WEB_MIGRATION_HIT_PREFIX } from './cloud-web-migration.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.cloud-web-migration', {
    url: '/cloud-web-migration',
    layout: { name: 'modal', keyboard: true },
    views: {
      modal: {
        component: 'hostingCloudWebMigrationComponent',
      },
    },
    // A direct URL must not open the consent modal on a service that is not
    // active: the dashboard never offers it there (see handleCloudWebMigration).
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('Hosting')
        .then((Hosting) => Hosting.getSelected(transition.params().productId))
        .then(({ serviceState }) =>
          serviceState === 'ACTIVE'
            ? false
            : { state: 'app.hosting.dashboard' },
        )
        .catch(() => ({ state: 'app.hosting.dashboard' })),
    resolve: {
      breadcrumb: () => null,

      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,

      trackClick: /* @ngInject */ (atInternet) => (hitPrefix) => {
        atInternet.trackClick({
          name: `${CLOUD_WEB_MIGRATION_HIT_PREFIX}::${hitPrefix}`,
          type: 'action',
        });
      },
    },
    atInternet: {
      rename: CLOUD_WEB_MIGRATION_HIT_PREFIX,
    },
  });
};
