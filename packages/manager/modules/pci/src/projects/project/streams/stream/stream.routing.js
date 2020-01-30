export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.streams.stream', {
    url: '/:streamId',
    component: 'pciProjectStreamsStream',

    resolve: {
      breadcrumb: /* @ngInject */ (stream) => stream.name,
      streamId: /* @ngInject */ ($transition$) =>
        $transition$.params().streamId,
      stream: /* @ngInject */ (PciProjectStreamService, projectId, streamId) =>
        PciProjectStreamService.get(projectId, streamId)
          .then((stream) =>
            PciProjectStreamService.getRegion(projectId, stream),
          )
          .then((stream) =>
            PciProjectStreamService.getTokens(projectId, stream),
          ),
      editBacklogRetention: /* @ngInject */ (
        $state,
        projectId,
        streamId,
      ) => () =>
        $state.go('pci.projects.project.streams.stream.backlogRetention', {
          projectId,
          streamId,
        }),
      editReplayRetention: /* @ngInject */ (
        $state,
        projectId,
        streamId,
      ) => () =>
        $state.go('pci.projects.project.streams.stream.replayRetention', {
          projectId,
          streamId,
        }),
      editThrottling: /* @ngInject */ ($state, projectId, streamId) => () =>
        $state.go('pci.projects.project.streams.stream.throttling', {
          projectId,
          streamId,
        }),
      viewSubscriptions: /* @ngInject */ ($state, projectId, streamId) => () =>
        $state.go('pci.projects.project.streams.stream.subscriptions', {
          projectId,
          streamId,
        }),
      regenerateToken: /* @ngInject */ ($state, projectId, streamId) => () =>
        $state.go('pci.projects.project.streams.stream.regenerateTokens', {
          projectId,
          streamId,
        }),
      deleteStream: /* @ngInject */ ($state, projectId, streamId) => () =>
        $state.go('pci.projects.project.streams.stream.delete', {
          projectId,
          streamId,
        }),
      streamLink: /* @ngInject */ ($state, projectId, stream) =>
        $state.href('pci.projects.project.streams.stream', {
          projectId,
          streamId: stream.id,
        }),
      subscriptionsLink: /* @ngInject */ ($state, projectId, stream) =>
        $state.href('pci.projects.project.streams.stream.subscriptions', {
          projectId,
          streamId: stream.id,
        }),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      goToStream: /* @ngInject */ (
        CucCloudMessage,
        $state,
        projectId,
        streamId,
      ) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.streams.stream',
          {
            projectId,
            streamId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](
              message,
              'pci.projects.project.streams.stream',
            ),
          );
        }

        return promise;
      },
    },
  });
};
