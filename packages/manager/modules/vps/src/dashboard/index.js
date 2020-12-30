import angular from 'angular';
import '@uirouter/angularjs';

import component from './vps-dashboard.component';
import routing from './vps-dashboard.routing';

import vpsUpgradeTileService from './tile/configuration/upgrade/service';
import vpsMigrationService from '../migration/vps-migration.service';

import vpsTileStatusItem from './vpsTileStatus/vps-tile-status.component';

import ovhManagerVpsDashboardDisplayIps from './modal/display-ips';
import ovhManagerVpsDashboardKvm from './modal/kvm';
import ovhManagerVpsDashboardMonitoringSla from './modal/monitoring-sla';
import ovhManagerVpsDashboardReboot from './modal/reboot';
import ovhManagerVpsDashboardRebootRescue from './modal/password';
import ovhManagerVpsDashboardRebuild from './rebuild';
import ovhManagerVpsDashboardReinstall from './modal/reinstall';
import ovhManagerVpsDashboardReverseDns from './modal/reverse-dns';
import ovhManagerVpsDashboardSchedule from './migration-schedule';
import ovhManagerVpsDashboardSnapshotDelete from './modal/snapshot-delete';
import ovhManagerVpsDashboardSnapshotRestore from './modal/snapshot-restore';
import ovhManagerVpsDashboardSnapshotTake from './modal/snapshot-take';
import ovhManagerVpsDashboardTerminate from './terminate';
import ovhManagerVpsDashboardTerminateOption from './modal/terminate-option';
import ovhManagerVpsDashboardTile from './tile';
import advices from './advices';

const moduleName = 'ovhManagerVpsDashboard';

angular
  .module(moduleName, [
    advices,
    ovhManagerVpsDashboardRebuild,
    ovhManagerVpsDashboardTerminate,
    ovhManagerVpsDashboardDisplayIps,
    ovhManagerVpsDashboardKvm,
    ovhManagerVpsDashboardMonitoringSla,
    ovhManagerVpsDashboardReboot,
    ovhManagerVpsDashboardRebootRescue,
    ovhManagerVpsDashboardReinstall,
    ovhManagerVpsDashboardReverseDns,
    ovhManagerVpsDashboardSchedule,
    ovhManagerVpsDashboardSnapshotDelete,
    ovhManagerVpsDashboardSnapshotRestore,
    ovhManagerVpsDashboardSnapshotTake,
    ovhManagerVpsDashboardTerminateOption,
    ovhManagerVpsDashboardTile,
    'ui.router',
  ])
  .service('vpsUpgradeTile', vpsUpgradeTileService)
  .service('VpsMigrationService', vpsMigrationService)
  .component(component.name, component)
  .component(vpsTileStatusItem.name, vpsTileStatusItem)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
