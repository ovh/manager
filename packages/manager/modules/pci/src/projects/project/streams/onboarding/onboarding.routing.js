export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.streams.onboarding', {
      url: '/onboarding',
      component: 'pciProjectStreamsOnboarding',
      redirectTo: transition => transition
        .injector()
        .getAsync('streams')
        .then(streams => (streams.length > 0 ? { state: 'pci.projects.project.streams' } : false)),
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
        addStream: /* @ngInject */ ($state, projectId) => () => $state.go('pci.projects.project.streams.add', {
          projectId,
        }),
      },
    });
};
