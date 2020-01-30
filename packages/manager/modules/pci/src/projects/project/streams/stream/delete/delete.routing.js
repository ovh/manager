export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.streams.stream.delete', {
    url: '/delete',
    views: {
      modal: {
        component: 'ovhManagerPciStreamsStreamDelete',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToStreams) => goToStreams,
      breadcrumb: () => null,
    },
  });
};
