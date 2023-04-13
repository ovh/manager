export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.etl.onboarding', {
    url: '/onboarding',
    component: 'pciProjectEtlOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('workflows')
        .then((workflows) =>
          workflows.length > 0 ? { state: 'pci.projects.project.etl' } : false,
        ),
    resolve: {
      breadcrumb: /* @ngInject */ () => null, // Hide breadcrumb,
      goToCli: /* @ngInject */ ($state) => () =>
        $state.go('pci.projects.project.etl.cli'),
    },
  });
};
