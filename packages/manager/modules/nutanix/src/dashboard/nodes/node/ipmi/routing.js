import { IPMI_TRACKING_PREFIX } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.node.ipmi', {
    url: '/ipmi',
    views: {
      serverView: 'nutanixNodeIpmi',
    },
    resolve: {
      trackingPrefix: /* @ngInject */ () => IPMI_TRACKING_PREFIX,
      breadcrumb: /* @ngInject */ () => 'IPMI',
    },
    atInternet: {
      rename: IPMI_TRACKING_PREFIX,
    },
  });
};
