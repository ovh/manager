export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.streams.stream.replayRetention', {
    url: '/replay-retention',
    views: {
      modal: {
        component: 'ovhManagerPciStreamsStreamReplayRetention',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToStream) => goToStream,
      breadcrumb: () => null,
    },
  });
};
