import OidcProvider from './OidcProvider.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.kubernetes.details.service', {
    url: '/service',
    views: {
      kubernetesView: 'ovhManagerPciProjectKubernetesServiceComponent',
    },
    resolve: {
      oidcProvider: /* @ngInject */ (Kubernetes, projectId, kubeId) =>
        Kubernetes.getOidcProvider(projectId, kubeId).then(
          (oidcProvider) => new OidcProvider(oidcProvider),
        ),

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

      resetKubeconfig: /* @ngInject */ ($state, kubeId, projectId) => () =>
        $state.go(
          'pci.projects.project.kubernetes.details.service.reset-kubeconfig',
          {
            kubeId,
            projectId,
          },
        ),

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

      addOidcProvider: /* @ngInject */ ($state, kubeId, projectId) => () =>
        $state.go(
          'pci.projects.project.kubernetes.details.service.add-oidc-provider',
          { kubeId, projectId },
        ),

      updateOidcProvider: /* @ngInject */ ($state, kubeId, projectId) => () =>
        $state.go(
          'pci.projects.project.kubernetes.details.service.update-oidc-provider',
          { kubeId, projectId },
        ),

      removeOidcProvider: /* @ngInject */ ($state, kubeId, projectId) => () =>
        $state.go(
          'pci.projects.project.kubernetes.details.service.remove-oidc-provider',
          { kubeId, projectId },
        ),

      isVersionSupported: /* @ngInject */ (clusterMinorVersion, versions) =>
        versions.includes(clusterMinorVersion.toString()),

      breadcrumb: () => false,
    },
  });
};
