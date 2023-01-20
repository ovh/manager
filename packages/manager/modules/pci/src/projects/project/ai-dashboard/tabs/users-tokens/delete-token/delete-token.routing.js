export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.ai-dashboard.users-tokens.delete-token',
    {
      url: '/delete-token/:tokenId',
      params: {
        tokenId: null,
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
        tokenId: /* @ngInject */ ($transition$) =>
          $transition$.params().tokenId,
        token: /* @ngInject */ (aiTokens, tokenId) =>
          aiTokens.find((token) => token.id === tokenId),
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
