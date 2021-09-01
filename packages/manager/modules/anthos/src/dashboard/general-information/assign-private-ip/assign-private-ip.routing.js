export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'anthos.dashboard.general-information.assign-private-ip',
    {
      url: '/assign-private-ip',
      views: {
        modal: {
          component: 'assignPrivateIp',
        },
      },
      layout: 'modal',
      resolve: {
        breacrumb: () => false,
      },
    },
  );
};
