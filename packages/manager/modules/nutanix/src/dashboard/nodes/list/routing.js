import {
  PREFIX_TRACKING_NUTANIX_DATAGRID,
  PREFIX_TRACKING_NUTANIX_NUTANIX,
} from '../../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.all', {
    url: '',
    component: 'nutanixAllNodes',
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
      goToAddNode: /* @ngInject */ ($state) => () =>
        $state.go('nutanix.dashboard.nodes.all.add-nodes'),
      powerOffNode: /* @ngInject */ ($state, atInternet) => (node) => {
        atInternet.trackClick({
          name: `${PREFIX_TRACKING_NUTANIX_DATAGRID}::button::poweroff::node::${node}`,
          type: 'action',
        });
        return $state.go('nutanix.dashboard.nodes.all.poweroff-node', {
          node,
        });
      },
      installNode: /* @ngInject */ ($state, atInternet) => (node) => {
        atInternet.trackClick({
          name: `${PREFIX_TRACKING_NUTANIX_DATAGRID}::button::install::node::${node}`,
          type: 'action',
        });
        return $state.go('nutanix.dashboard.nodes.all.install-node', {
          node,
        });
      },
      reinstallNode: /* @ngInject */ ($state, atInternet) => (node) => {
        atInternet.trackClick({
          name: `${PREFIX_TRACKING_NUTANIX_DATAGRID}::button::reinstall::node::${node}`,
          type: 'action',
        });
        return $state.go('nutanix.dashboard.nodes.all.reinstall-node', {
          node,
        });
      },
      uninstallNode: /* @ngInject */ ($state, atInternet) => (node) => {
        atInternet.trackClick(
          `${PREFIX_TRACKING_NUTANIX_DATAGRID}::button::uninstall::node`,
        );
        return $state.go('nutanix.dashboard.nodes.all.uninstall-node', {
          node,
        });
      },
      terminateNode: /* @ngInject */ ($state, atInternet) => (node) => {
        atInternet.trackClick({
          name: `${PREFIX_TRACKING_NUTANIX_DATAGRID}::button::terminate::node::${node}`,
          type: 'action',
        });
        return $state.go('nutanix.dashboard.nodes.all.resiliate-node', {
          node,
        });
      },
      powerOnNode: /* ngInject */ (NutanixService, atInternet) => (
        nodeName,
      ) => {
        atInternet.trackClick({
          name: `${PREFIX_TRACKING_NUTANIX_DATAGRID}::button::poweron::node::${nodeName}`,
          type: 'action',
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
      rename: `${PREFIX_TRACKING_NUTANIX_NUTANIX}::listing::cluster::nodes`,
    },
  });
};
