export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.serving.onboarding', {
      url: '/onboarding',
      component: 'pciProjectServingOnboarding',

      redirectTo: transition => Promise.all([
        transition.injector().getAsync('lab'),
        transition.injector().getAsync('namespaces'),
      ]).then(([lab, namespaces]) => {
        if (namespaces.length > 0 && !lab.isOpen()) {
          return { state: 'pci.projects.project.serving' };
        }
        return false;
      }),

      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
        addNamespace: /* @ngInject */ (
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
            .then(() => $state.go('pci.projects.project.serving.add', {
              projectId,
            }, {
              reload: true,
            }));
        },
      },
    });
};
