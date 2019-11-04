import { CLOUD_DATABASE_ERRORS, CLOUD_DATABASE_FEATURE } from './vps-cloud-database.constants';

import component from './vps-cloud-database.component';

export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('iaas.vps.detail.cloud-database', {
      resolve: {
        isAuthorized: /* @ngInject */ (
          $q,
          capabilities,
        ) => (capabilities.includes(CLOUD_DATABASE_FEATURE)
          ? null
          : $q.reject(CLOUD_DATABASE_ERRORS.notAuthorized)),
      },
      url: '/cloud-database',
      views: {
        'vpsContent@iaas.vps.detail': {
          component: component.name,
        },
      },
    });
};
