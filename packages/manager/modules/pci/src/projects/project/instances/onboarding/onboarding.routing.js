export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.instances.onboarding', {
      url: '/onboarding',
      component: 'pciProjectInstancesOnboarding',
      redirectTo: (transition) => transition
        .injector()
        .getAsync('instances')
        .then((instances) => (instances.length > 0 ? { state: 'pci.projects.project.instances' } : false)),
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
        addInstance: /* @ngInject */ ($state, projectId) => () => $state.go('pci.projects.project.instances.add', {
          projectId,
        }),
      },
    });
};
