export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.ai-dashboard.users-tokens.delete-token',
    {
      url: '/delete-token',
      params: {
        token: null,
      },
      views: {
        modal: {
          component: 'pciProjectAiDashboardDeleteTokenModalComponent',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToUsersToken) => goBackToUsersToken,
        token: /* @ngInject */ ($transition$) => $transition$.params().token,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
