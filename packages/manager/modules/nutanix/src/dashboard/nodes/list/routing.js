import {
  ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
  PREFIX_TRACKING_NUTANIX_DATAGRID,
  PREFIX_TRACKING_NUTANIX_NUTANIX,
} from '../../../constants';

const TRACKING_PAGE_NAME = `${PREFIX_TRACKING_NUTANIX_NUTANIX}::listing::cluster::nodes`;

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.all', {
    url: '',
    component: 'nutanixAllNodes',
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
      goToAddNode: /* @ngInject */ ($state) => () =>
        $state.go('nutanix.dashboard.nodes.all.add-nodes'),
      trackClick: /* @ngInject */ (atInternet) => (trackClickOptions) =>
        atInternet.trackClick({
          page: {
            name: TRACKING_PAGE_NAME,
          },
          level2: ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
          type: 'action',
          ...trackClickOptions,
        }),
      powerOffNode: /* @ngInject */ ($state, trackClick, commercialRange) => (
        node,
      ) => {
        trackClick({
          name: `${PREFIX_TRACKING_NUTANIX_DATAGRID}::button::poweroff::node::${commercialRange}`,
        });
        return $state.go('nutanix.dashboard.nodes.all.poweroff-node', {
          node,
        });
      },
      installNode: /* @ngInject */ ($state, trackClick, commercialRange) => (
        node,
      ) => {
        trackClick({
          name: `${PREFIX_TRACKING_NUTANIX_DATAGRID}::button::install::node::${commercialRange}`,
        });
        return $state.go('nutanix.dashboard.nodes.all.install-node', {
          node,
        });
      },
      reinstallNode: /* @ngInject */ ($state, trackClick, commercialRange) => (
        node,
      ) => {
        trackClick({
          name: `${PREFIX_TRACKING_NUTANIX_DATAGRID}::button::reinstall::node::${commercialRange}`,
        });
        return $state.go('nutanix.dashboard.nodes.all.reinstall-node', {
          node,
        });
      },
      uninstallNode: /* @ngInject */ ($state, trackClick, commercialRange) => (
        node,
      ) => {
        trackClick({
          name: `${PREFIX_TRACKING_NUTANIX_DATAGRID}::button::uninstall::node::${commercialRange}`,
        });
        return $state.go('nutanix.dashboard.nodes.all.uninstall-node', {
          node,
        });
      },
      terminateNode: /* @ngInject */ ($state, trackClick, commercialRange) => (
        node,
      ) => {
        trackClick({
          name: `${PREFIX_TRACKING_NUTANIX_DATAGRID}::button::terminate::node::${commercialRange}`,
        });
        return $state.go('nutanix.dashboard.nodes.all.resiliate-node', {
          node,
        });
      },
      powerOnNode: /* ngInject */ (
        NutanixService,
        trackClick,
        commercialRange,
      ) => (nodeName) => {
        trackClick({
          name: `${PREFIX_TRACKING_NUTANIX_DATAGRID}::button::poweron::node::${commercialRange}`,
        });
        return NutanixService.updateClusterNodePowerStateOn(nodeName);
      },
      handleSuccess: /* @ngInject */ (Alerter) => (message) => {
        Alerter.success(message, 'nutanix_dashboard_alert');
      },
      handleError: /* @ngInject */ (Alerter) => (message) => {
        Alerter.error(message, 'nutanix_dashboard_alert');
      },
    },
    atInternet: {
      rename: TRACKING_PAGE_NAME,
      level2: ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
    },
  });
};
