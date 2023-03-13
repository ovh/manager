export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.ai-dashboard.users-tokens.create-user',
    {
      url: '/create-user',
      views: {
        modal: {
          component: 'pciProjectAiDashboardCreateUserModal',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goBackToUsersToken) => goBackToUsersToken,
      },
    },
  );
};
