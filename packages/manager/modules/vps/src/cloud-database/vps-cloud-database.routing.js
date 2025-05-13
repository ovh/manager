import {
  CLOUD_DATABASE_ERRORS,
  CLOUD_DATABASE_FEATURE,
} from './vps-cloud-database.constants';

import component from './vps-cloud-database.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.cloud-database', {
    resolve: {
      isAuthorized: /* @ngInject */ ($q, capabilities) =>
        capabilities.includes(CLOUD_DATABASE_FEATURE)
          ? null
          : $q.reject(CLOUD_DATABASE_ERRORS.notAuthorized),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('vps_cloud_database'),
    },
    url: '/cloud-database',
    views: {
      'vpsContent@vps.detail': {
        component: component.name,
      },
    },
  });
};
