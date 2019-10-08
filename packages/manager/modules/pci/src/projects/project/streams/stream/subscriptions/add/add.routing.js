export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.streams.stream.subscriptions.add', {
    url: '/new',
    views: {
      modal: {
        component: 'ovhManagerPciStreamsStreamSubscriptionsAdd',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ goToSubscriptions => goToSubscriptions,
      breadcrumb: () => null,
    },
  });
};
