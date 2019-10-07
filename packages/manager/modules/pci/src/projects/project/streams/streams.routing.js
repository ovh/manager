export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.streams', {
      url: '/streams',
      component: 'pciProjectStreams',

      redirectTo: transition => Promise.all([
        transition.injector().getAsync('lab'),
        transition.injector().getAsync('streams'),
      ]).then(([lab, streams]) => {
        if (streams.length === 0 || lab.isOpen()) {
          return { state: 'pci.projects.project.streams.onboarding' };
        }
        return false;
      }),

      resolve: {
        breadcrumb: /* @ngInject */ $translate => $translate.instant('pci_projects_project_streams_title'),
        lab: /* @ngInject */ (
          PciProjectLabsService,
          projectId,
        ) => PciProjectLabsService.getLabByName(projectId, 'ioStream'),

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

        goToStreams: /* @ngInject */ ($state, CucCloudMessage, projectId) => (message = false, type = 'success') => {
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
