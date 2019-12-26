export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.streams.stream.subscriptions.delete',
    {
      url: '/delete?subscriptionId',
      views: {
        modal: {
          component: 'ovhManagerPciStreamsStreamSubscriptionsDelete',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToSubscriptions) => goToSubscriptions,
        breadcrumb: () => null,
        subscriptionId: /* @ngInject */ ($transition$) =>
          $transition$.params().subscriptionId,
        subscription: /* @ngInject */ (
          PciProjectStreamsStreamSubscriptionsService,
          projectId,
          subscriptionId,
          streamId,
        ) =>
          PciProjectStreamsStreamSubscriptionsService.get(
            projectId,
            streamId,
            subscriptionId,
          ),
      },
    },
  );
};
