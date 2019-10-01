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
          PciProjectStreamService,
        ) => PciProjectStreamService.getSubscriptions(projectId, streamId),

        addSubscribtionLink: /* @ngInject */($state, projectId, streamId) => $state.href('pci.projects.project.streams.stream.subscriptions.add', {
          projectId,
          streamId,
        }),
        resetSubscription: /* @ngInject */ ($state, projectId, streamId) => subscription => $state.go('pci.projects.project.streams.stream.subscriptions.reset', {
          projectId,
          streamId,
          subscriptionId: subscription.id,
        }),
        deleteSubscription: /* @ngInject */ ($state, projectId, streamId) => subscription => $state.go('pci.projects.project.streams.stream.subscriptions.delete', {
          projectId,
          streamId,
          subscriptionId: subscription.id,
        }),
      },
    });
};
