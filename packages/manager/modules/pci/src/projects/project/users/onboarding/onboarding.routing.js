export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.users.onboarding', {
      url: '/onboarding',
      component: 'pciProjectInstancesOnboarding',
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
        addUser: /* @ngInject */ ($state, projectId) => () => $state.go('pci.projects.project.users.onboarding.add', {
          projectId,
        }),
      },
    });
};
