import angular from 'angular';
import '@uirouter/angularjs';

import component from './vps-dashboard.component';
import routing from './vps-dashboard.routing';

import vpsTileStatusItem from './vpsTileStatus/vps-tile-status.component';

import ovhManagerVpsDashboardRebuild from './rebuild';
import ovhManagerVpsDashboardTerminate from './terminate';
import ovhManagerVpsDashboardDisplayIps from './modal/display-ips';
import ovhManagerVpsDashboardKvm from './modal/kvm';
import ovhManagerVpsDashboardMonitoringSla from './modal/monitoring-sla';
import ovhManagerVpsDashboardReboot from './modal/reboot';
import ovhManagerVpsDashboardRebootRescue from './modal/password';
import ovhManagerVpsDashboardReinstall from './modal/reinstall';
import ovhManagerVpsDashboardReverseDns from './modal/reverse-dns';
import ovhManagerVpsDashboardTerminateOption from './modal/terminate-option';
import ovhManagerVpsDashboardTile from './tile';
import ovhManagerVpsDashboardSnapshotDelete from './modal/snapshot-delete';
import ovhManagerVpsDashboardSnapshotRestore from './modal/snapshot-restore';
import ovhManagerVpsDashboardSnapshotTake from './modal/snapshot-take';

const moduleName = 'ovhManagerVpsDashboard';

angular
  .module(moduleName, [
    ovhManagerVpsDashboardRebuild,
    ovhManagerVpsDashboardTerminate,
    ovhManagerVpsDashboardDisplayIps,
    ovhManagerVpsDashboardKvm,
    ovhManagerVpsDashboardMonitoringSla,
    ovhManagerVpsDashboardReboot,
    ovhManagerVpsDashboardRebootRescue,
    ovhManagerVpsDashboardReinstall,
    ovhManagerVpsDashboardReverseDns,
    ovhManagerVpsDashboardSnapshotDelete,
    ovhManagerVpsDashboardSnapshotRestore,
    ovhManagerVpsDashboardSnapshotTake,
    ovhManagerVpsDashboardTerminateOption,
    ovhManagerVpsDashboardTile,
    'ui.router',
  ])
  .component(component.name, component)
  .component(vpsTileStatusItem.name, vpsTileStatusItem)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
