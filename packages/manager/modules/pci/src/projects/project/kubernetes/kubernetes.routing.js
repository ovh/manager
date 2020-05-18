import get from 'lodash/get';
import map from 'lodash/map';
import max from 'lodash/max';

import { VERSION_ENUM_KEY } from './kubernetes.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.kubernetes', {
    url: '/kubernetes',
    component: 'ovhManagerPciProjectKubernetes',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('kubernetes')
        .then((kubernetes) =>
          kubernetes.length === 0
            ? { state: 'pci.projects.project.kubernetes.onboarding' }
            : false,
        ),
    resolve: {
      addCluster: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.kubernetes.add', { projectId }),
      goToKubernetes: ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.kubernetes',
          {
            projectId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() => CucCloudMessage[type](message, 'kubernetes'));
        }

        return promise;
      },

      kubernetes: /* @ngInject */ (OvhApiCloudProjectKube, projectId) =>
        OvhApiCloudProjectKube.v6()
          .query({
            serviceName: projectId,
          })
          .$promise.then((kubernetes) => map(kubernetes, (id) => ({ id }))),

      /* @ngInject */
      versions: (OvhApiCloud) =>
        OvhApiCloud.v6()
          .schema()
          .$promise.then((schema) => get(schema, VERSION_ENUM_KEY)),

      /* @ngInject */
      highestVersion: (versions) =>
        max(versions, (version) => parseFloat(`${version}`)),

      regions: /* @ngInject */ (OvhApiCloudProjectKube, projectId) =>
        OvhApiCloudProjectKube.v6()
          .getRegions({
            serviceName: projectId,
          })
          .$promise.then((regions) =>
            map(regions, (region) => ({
              name: region,
              hasEnoughQuota: () => true,
            })),
          ),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('kube_list_title'),
    },
  });
};
