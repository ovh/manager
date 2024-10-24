import { FUNNEL_TRACKING_PREFIX } from '../ip-ip-agoraOrder.constant';

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
      rename: `${FUNNEL_TRACKING_PREFIX}tile::add_additional_ip::select_version::next_ipv6`,
    },
  });
};
