export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.kubernetes.add', {
    url: '/new',
    component: 'ovhManagerPciProjectKubernetesAdd',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('regions')
        .then((regions) =>
          regions?.length === 0
            ? { state: 'pci.projects.project.kubernetes.onboarding' }
            : false,
        ),
    resolve: {
      goBack: /* @ngInject */ (goToKubernetes) => goToKubernetes,

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('kubernetes_add'),
    },
  });
};
