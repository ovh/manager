export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai.tokens.add', {
    url: '/add?resource',
    params: {
      resource: null,
    },
    views: {
      modal: {
        component: 'ovhManagerPciAiTokensAdd',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToTokens) => goToTokens,
      resource: /* @ngInject */ ($stateParams) => $stateParams.resource,
      regions: /* @ngInject */ (PciProjectAiService, projectId) =>
        PciProjectAiService.getRegions(projectId),
      breadcrumb: () => null,
    },
  });
};
