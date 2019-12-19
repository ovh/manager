export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.streams.stream.throttling', {
    url: '/throttling',
    views: {
      modal: {
        component: 'ovhManagerPciStreamsStreamThrottling',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToStream) => goToStream,
      breadcrumb: () => null,
    },
  });
};
