export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.streams.onboarding', {
    url: '/onboarding',
    component: 'pciProjectStreamsOnboarding',

    redirectTo: (transition) =>
      Promise.all([
        transition.injector().getAsync('lab'),
        transition.injector().getAsync('streams'),
      ]).then(([lab, streams]) => {
        if (streams.length > 0 && !lab.isOpen()) {
          return { state: 'pci.projects.project.streams' };
        }
        return false;
      }),

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

        labPromise.then(() =>
          $state.go(
            'pci.projects.project.streams.add',
            {
              projectId,
            },
            {
              reload: true,
            },
          ),
        );
      },
    },
  });
};
