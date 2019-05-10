import get from 'lodash/get';
import map from 'lodash/map';

import { VERSION_ENUM_KEY } from './add.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.kubernetes.add', {
      url: '/new',
      component: 'ovhManagerPciProjectKubernetesAdd',
      resolve: {
        regions: /* @ngInject */ (
          OvhApiCloudProjectKube,
          projectId,
        ) => OvhApiCloudProjectKube.v6()
          .getRegions({
            serviceName: projectId,
          }).$promise
          .then(regions => map(regions, region => ({
            name: region,
            hasEnoughQuota: () => true,
          }))),

        versions: /* @ngInject */
          OvhApiCloudProjectKube => OvhApiCloudProjectKube.v6().getSchema().$promise
            .then(schema => get(schema, VERSION_ENUM_KEY)),

        goBack: /* @ngInject */ goToKubernetes => goToKubernetes,

        breadcrumb: /* @ngInject */ $translate => $translate.instant('kubernetes_add'),
      },
    });
};
