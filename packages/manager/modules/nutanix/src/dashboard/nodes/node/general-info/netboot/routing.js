import { NETBOOT_TRACKING_PREFIX } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.node.general-info.netboot', {
    url: '/netboot',
    component: 'nutanixNodeServerNetboot',
    resolve: {
      trackingPrefix: /* @ngInject */ () => NETBOOT_TRACKING_PREFIX,
      goBack: /* @ngInject */ (goToNutanixNode) => goToNutanixNode,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('nutanix_node_server_configuration_netboot_title'),
    },
    atInternet: {
      rename: NETBOOT_TRACKING_PREFIX,
    },
  });
};
