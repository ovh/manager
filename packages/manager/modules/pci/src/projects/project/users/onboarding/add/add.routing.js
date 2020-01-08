export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.users.onboarding.add', {
    url: '/new',
    views: {
      modal: {
        component: 'pciProjectUsersAdd',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
      goBack: /* @ngInject */ (goToUsers) => goToUsers,
      goToNextStep: /* @ngInject */ ($state, projectId) => (description) =>
        $state.go('pci.projects.project.users.onboarding.add.roles', {
          projectId,
          description,
        }),
    },
  });
};
