export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.streams', {
      url: '/streams',
      component: 'pciProjectStreams',

      redirectTo: transition => transition
        .injector()
        .getAsync('streams')
        .then(streams => (streams.length === 0 ? { state: 'pci.projects.project.streams.onboarding' } : false)),

      resolve: {
        breadcrumb: /* @ngInject */ $translate => $translate.instant('pci_projects_project_streams_title'),

        streams: /* @ngInject */ (
          PciProjectStreamService,
          projectId,
        ) => PciProjectStreamService.getAll(projectId),

        getStreamDetails: /* @ngInject */ (
          PciProjectStreamService,
          projectId,
        ) => stream => PciProjectStreamService.getStats(projectId, stream),

        viewStream: /* @ngInject */ ($state, projectId) => stream => $state.go('pci.projects.project.streams.stream', {
          projectId,
          streamId: stream.id,
        }),
        deleteStream: /* @ngInject */ ($state, projectId) => stream => $state.go('pci.projects.project.streams.delete', {
          projectId,
          streamId: stream.id,
        }),

        addStreamLink: /* @ngInject */($state, projectId) => $state.href('pci.projects.project.streams.add', {
          projectId,
        }),

        streamLink: /* @ngInject */ ($state, projectId) => stream => $state.href('pci.projects.project.streams.stream', {
          projectId,
          streamId: stream.id,
        }),

        goToStreams: /* @ngInject */ (CucCloudMessage, $state, projectId) => (message = false, type = 'success') => {
          const reload = message && type === 'success';

          const promise = $state.go('pci.projects.project.streams', {
            projectId,
          },
          {
            reload,
          });

          if (message) {
            promise.then(() => CucCloudMessage[type](message, 'pci.projects.project.streams'));
          }

          return promise;
        },
      },
    });
};
