export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai.tokens.add', {
    url: '/add?labelSelector',
    params: {
      labelSelector: null,
    },
    views: {
      modal: {
        component: 'ovhManagerPciAiTokensAdd',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToTokens) => goToTokens,
      labelSelector: /* @ngInject */ ($stateParams) =>
        $stateParams.labelSelector,
      regions: /* @ngInject */ (PciProjectAiService, projectId) =>
        PciProjectAiService.getRegions(projectId),
      breadcrumb: () => null,
    },
  });
};
