export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.kubernetes.details.service', {
    url: '/service',
    views: {
      kubernetesView: 'ovhManagerPciProjectKubernetesServiceComponent',
    },
    resolve: {
      getKubeConfig: /* @ngInject */ (Kubernetes, kubeId, projectId) => () =>
        Kubernetes.getKubeConfig(projectId, kubeId),

      changeClusterName: /* @ngInject */ ($state, kubeId, projectId) => () =>
        $state.go('pci.projects.project.kubernetes.details.service.name', {
          kubeId,
          projectId,
        }),

      clusterMinorVersion: /* @ngInject */ (cluster) => {
        const [majorVersion, minorVersion] = cluster.version.split('.');
        return `${majorVersion}.${minorVersion}`;
      },

      resetCluster: /* @ngInject */ ($state, kubeId, projectId) => () =>
        $state.go('pci.projects.project.kubernetes.details.service.reset', {
          kubeId,
          projectId,
        }),

      createNodePool: /* @ngInject */ ($state, kubeId, projectId) => () =>
        $state.go('pci.projects.project.kubernetes.details.nodepools.add', {
          kubeId,
          projectId,
        }),

      terminate: /* @ngInject */ ($state, kubeId, projectId) => () =>
        $state.go('pci.projects.project.kubernetes.details.service.terminate', {
          kubeId,
          projectId,
        }),

      updateCluster: /* @ngInject */ ($state, kubeId, projectId) => (
        isMinorVersionUpgrade,
      ) =>
        $state.go('pci.projects.project.kubernetes.details.service.update', {
          kubeId,
          projectId,
          isMinorVersionUpgrade,
        }),

      updatePolicy: /* @ngInject */ ($state, kubeId, projectId) => () =>
        $state.go(
          'pci.projects.project.kubernetes.details.service.upgradePolicy',
          { kubeId, projectId },
        ),

      isVersionSupported: /* @ngInject */ (clusterMinorVersion, versions) =>
        versions.includes(clusterMinorVersion.toString()),

      breadcrumb: () => false,
    },
  });
};
