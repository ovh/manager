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
