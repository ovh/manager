export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.kubernetes', {
      url: '/kubernetes',
      component: 'ovhManagerPciProjectKubernetes',
      resolve: {
        breadcrumb: /* @ngInject */ $translate => $translate
          .refresh()
          .then(() => $translate.instant('kube_list_title')),
      },
    });
};
