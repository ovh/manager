export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.agora-order.ipv6', {
    url: '/ipv6',
    component: 'agoraIpV6Order',
    params: {
      ipType: 'ipv6',
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => false,
    },
    atInternet: {
      rename: 'dedicated::ip::dashboard::order::ipv6',
    },
  });
};
