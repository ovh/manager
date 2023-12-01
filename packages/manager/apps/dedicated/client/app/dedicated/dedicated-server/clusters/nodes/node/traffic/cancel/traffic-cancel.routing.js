export default /* @ngInject */ ($stateProvider) => {
  const parentStates = [
    'app.dedicated-cluster.cluster.node.dashboard',
    'app.dedicated-cluster.cluster.node.interfaces',
  ];

  parentStates.forEach((parent) => {
    $stateProvider.state(`${parent}.traffic-cancel`, {
      url: '/traffic-cancel',
      views: {
        modal: {
          component: 'serverTrafficCancel',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ ($state) => () => $state.go('^'),
        breadcrumb: () => null,
      },
    });
  });
};
