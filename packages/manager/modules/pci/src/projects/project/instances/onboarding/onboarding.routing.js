export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.instances.onboarding', {
    url: '/onboarding',
    component: 'pciProjectInstancesOnboarding',
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
      addInstance: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.instances.add', {
          projectId,
        }),
    },
  });
};
