import { REGION } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.kubernetes.details', {
      url: '/:kubeId',
      component: 'ovhManagerPciProjectKubernetesDetailComponent',
      resolve: {
        kubeId: /* @ngInject */ $stateParams => $stateParams.kubeId,
        cluster: /* @ngInject */ (
          kubeId,
          OvhApiCloudProjectKube,
          projectId,
        ) => OvhApiCloudProjectKube.v6().get({
          serviceName: projectId,
          kubeId,
        }).$promise
          .then(cluster => ({
            ...cluster,
            region: REGION,
          })),

        goToKubernetesDetails: ($state, CucCloudMessage, kubeId, projectId) => (message = false, type = 'success') => {
          const reload = message && type === 'success';

          const promise = $state.go('pci.projects.project.kubernetes.details', {
            kubeId,
            projectId,
          },
          {
            reload,
          });

          if (message) {
            promise.then(() => CucCloudMessage[type](message, 'pci.projects.project.kubernetes.details'));
          }

          return promise;
        },

        breadcrumb: /* @ngInject */ cluster => cluster.name,

      },

      redirectTo: 'pci.projects.project.kubernetes.details.service',
    });
};
