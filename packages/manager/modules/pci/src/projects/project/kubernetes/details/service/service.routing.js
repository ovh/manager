import { CONFIG_FILENAME } from './service.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.kubernetes.details.service', {
      url: '/service',
      views: {
        kubernetesView: 'ovhManagerPciProjectKubernetesServiceComponent',
      },
      resolve: {
        kubernetesConfig: /* @ngInject */ (
          kubeId,
          OvhApiCloudProjectKube,
          projectId,
        ) => OvhApiCloudProjectKube.v6().getKubeConfig({
          serviceName: projectId,
          kubeId,
        }, {}).$promise
          .then(({ content }) => ({
            content,
            fileName: CONFIG_FILENAME,
          })),

        changeClusterName: /* @ngInject */ (
          $state,
          kubeId,
          projectId,
        ) => () => $state.go('pci.projects.project.kubernetes.details.service.name', { kubeId, projectId }),

        resetCluster: /* @ngInject */ (
          $state,
          kubeId,
          projectId,
        ) => () => $state.go('pci.projects.project.kubernetes.details.service.reset', { kubeId, projectId }),

        terminate: /* @ngInject */ (
          $state,
          kubeId,
          projectId,
        ) => () => $state.go('pci.projects.project.kubernetes.details.service.terminate', { kubeId, projectId }),

        updateCluster: /* @ngInject */ (
          $state,
          kubeId,
          projectId,
        ) => () => $state.go('pci.projects.project.kubernetes.details.service.update', { kubeId, projectId }),

        updatePolicy: /* @ngInject */ (
          $state,
          kubeId,
          projectId,
        ) => () => $state.go('pci.projects.project.kubernetes.details.service.upgradePolicy', { kubeId, projectId }),

        breadcrumb: () => false,
      },
    });
};
