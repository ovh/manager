export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.streams.stream.backlogRetention', {
    url: '/backlog-retention',
    views: {
      modal: {
        component: 'ovhManagerPciStreamsStreamBacklogRetention',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToStream) => goToStream,
      breadcrumb: () => null,
    },
  });
};
