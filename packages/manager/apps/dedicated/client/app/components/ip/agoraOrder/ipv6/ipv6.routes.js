import { TRACKING_PREFIX } from '../ip-ip-agoraOrder.constant';

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
      rename: `${TRACKING_PREFIX}ip::funnel::add_additional_ip`,
      level2: 57,
    },
  });
};
