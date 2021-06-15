export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.users.delete', {
    url: '/delete?userId',
    views: {
      modal: {
        component: 'pciProjectUsersDelete',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
      userId: /* @ngInject */ ($transition$) => $transition$.params().userId,
      user: /* @ngInject */ (
        PciProjectsProjectUsersService,
        projectId,
        userId,
      ) => PciProjectsProjectUsersService.get(projectId, userId),
      goBack: /* @ngInject */ (goToUsers) => goToUsers,
      removeUser: /* @ngInject */ (
        PciProjectsProjectUsersService,
        projectId,
      ) => (user) => PciProjectsProjectUsersService.delete(projectId, user),
    },
  });
};
