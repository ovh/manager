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
        addStream: /* @ngInject */ (
          $q,
          $state,
          lab,
          PciProjectLabsService,
          projectId,
        ) => () => {
          let labPromise;
          if (lab.isOpen()) {
            labPromise = PciProjectLabsService.activateLab(projectId, lab);
          } else {
            labPromise = $q.resolve();
          }

          labPromise
            .then(() => $state.go('pci.projects.project.streams.add', {
              projectId,
            }));
        },
      },
    });
};
