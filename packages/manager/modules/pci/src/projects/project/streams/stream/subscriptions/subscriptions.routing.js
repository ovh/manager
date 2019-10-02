export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.streams.stream.subscriptions', {
      url: '/subscriptions',
      component: 'pciProjectStreamsStreamSubscriptions',
      resolve: {
        breadcrumb: /* @ngInject */ $translate => $translate.instant('pci_projects_project_streams_stream_subscriptions_title'),
        subscriptions: /* @ngInject */ (
          projectId,
          streamId,
          PciProjectStreamsStreamSubscriptionsService,
        ) => PciProjectStreamsStreamSubscriptionsService.getAll(projectId, streamId),
        getSubscriptionDetails: /* @ngInject */ (
          projectId,
          streamId,
          PciProjectStreamsStreamSubscriptionsService,
        ) => subscription => PciProjectStreamsStreamSubscriptionsService
          .getStats(projectId, streamId, subscription),
        addSubscribtionLink: /* @ngInject */($state, projectId, streamId) => $state.href('pci.projects.project.streams.stream.subscriptions.add', {
          projectId,
          streamId,
        }),
        resetSubscription: /* @ngInject */ ($state, projectId, streamId) => subscription => $state.go('pci.projects.project.streams.stream.subscriptions.resetCursor', {
          projectId,
          streamId,
          subscriptionId: subscription.id,
        }),
        deleteSubscription: /* @ngInject */ ($state, projectId, streamId) => subscription => $state.go('pci.projects.project.streams.stream.subscriptions.delete', {
          projectId,
          streamId,
          subscriptionId: subscription.id,
        }),
        goToSubscriptions: /* @ngInject */ (CucCloudMessage, $state, projectId, streamId) => (message = false, type = 'success') => {
          const reload = message && type === 'success';

          const promise = $state.go('pci.projects.project.streams.stream.subscriptions', {
            projectId,
            streamId,
          },
          {
            reload,
          });

          if (message) {
            promise.then(() => CucCloudMessage[type](message, 'pci.projects.project.streams.stream'));
          }

          return promise;
        },

      },
    });
};
