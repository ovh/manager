export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.kubernetes.add', {
      url: '/new',
      component: 'ovhManagerPciProjectKubernetesAdd',
      resolve: {
        goBack: /* @ngInject */ goToKubernetes => goToKubernetes,

        breadcrumb: /* @ngInject */ $translate => $translate.instant('kubernetes_add'),
      },
    });
};
