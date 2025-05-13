export default /* @ngInject */ ($stateProvider) => {
  const parentStates = [
    'app.dedicated-server.server.dashboard',
    'app.dedicated-server.server.interfaces',
  ];

  parentStates.forEach((parent) => {
    $stateProvider.state(`${parent}.traffic-order`, {
      url: '/traffic-order',
      views: {
        modal: {
          component: 'serverTrafficOrder',
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
