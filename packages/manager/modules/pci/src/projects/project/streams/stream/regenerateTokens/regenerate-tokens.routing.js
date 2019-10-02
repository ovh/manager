export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.streams.stream.regenerateTokens', {
    url: '/tokens/regenerate',
    views: {
      modal: {
        component: 'ovhManagerPciStreamsStreamRegenerateTokens',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ goToStream => goToStream,
      breadcrumb: () => null,
    },
  });
};
