export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.streams.delete', {
    url: '/delete?streamId',
    views: {
      modal: {
        component: 'ovhManagerPciStreamsStreamDelete',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToStreams) => goToStreams,
      breadcrumb: () => null,
      streamId: /* @ngInject */($transition$) => $transition$.params().streamId,
      stream: /* @ngInject */ (
        PciProjectStreamService,
        projectId,
        streamId,
      ) => PciProjectStreamService.get(projectId, streamId),
    },
  });
};
