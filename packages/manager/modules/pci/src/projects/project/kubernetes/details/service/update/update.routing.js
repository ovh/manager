export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.kubernetes.details.service.update', {
      url: '/update',
      params: {
        isMinorVersionUpgrade: false,
      },
      views: {
        modal: {
          component: 'pciProjectKubernetesServiceUpdate',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToKubernetesDetails) => goToKubernetesDetails,
        breadcrumb: () => null,
        isMinorVersionUpgrade: /* @ngInject */
          ($transition$) => $transition$.params().isMinorVersionUpgrade,
        nextMinorVersion: /* @ngInject */ (cluster) => {
          const [majorVersion, minorVersion] = cluster.version.split('.');
          return `${majorVersion}.${parseInt(minorVersion, 10) + 1}`;
        },
      },
    });
};
