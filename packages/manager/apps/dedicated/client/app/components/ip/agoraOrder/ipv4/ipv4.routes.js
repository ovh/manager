export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.agora-order.ipv4', {
    url: '/ipv4',
    component: 'agoraIpV4Order',
    params: {
      ipType: 'ipv4',
      service: null,
      user: {},
      catalogName: {
        type: 'string',
        value: 'ip',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => false,
    },
    atInternet: {
      rename: 'dedicated::ip::dashboard::order::ipv4',
    },
  });
};
