import angular from 'angular';
import '@uirouter/angularjs';
import ovhManagerAdvices from '@ovh-ux/manager-advices';
import ovhManagerIncidentBanner from '@ovh-ux/manager-incident-banner';
import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import component from './vps-dashboard.component';
import routing from './vps-dashboard.routing';

import vpsUpgradeTileService from './tile/configuration/upgrade/service';
import vpsMigrationService from '../migration/vps-migration.service';

import vpsTileStatusItem from './vpsTileStatus/vps-tile-status.component';

import ovhManagerVpsDashboardCommitment from './commitment';
import ovhManagerVpsDashboardCancelCommitment from './cancel-commitment';
import ovhManagerVpsDashboardCancelResiliation from './cancel-resiliation';
import ovhManagerVpsDashboardDisplayIps from './modal/display-ips';
import ovhManagerVpsDashboardKvm from './modal/kvm';
import ovhManagerVpsDashboardMonitoringSla from './modal/monitoring-sla';
import ovhManagerVpsDashboardReboot from './modal/reboot';
import ovhManagerVpsDashboardRebootRescue from './modal/password';
import ovhManagerVpsDashboardRebuild from './rebuild';
import ovhManagerVpsDashboardReinstall from './modal/reinstall';
import ovhManagerVpsDashboardResiliation from './resiliation';
import ovhManagerVpsDashboardReverseDns from './modal/reverse-dns';
import ovhManagerVpsDashboardSchedule from './migration-schedule';
import ovhManagerVpsDashboardSnapshotDelete from './modal/snapshot-delete';
import ovhManagerVpsDashboardSnapshotRestore from './modal/snapshot-restore';
import ovhManagerVpsDashboardSnapshotTake from './modal/snapshot-take';
import ovhManagerVpsDashboardTerminate from './terminate';
import ovhManagerVpsDashboardTerminateOption from './modal/terminate-option';
import ovhManagerVpsDashboardTile from './tile';
import vpsStateInfo from './components/vps-state-info';

const moduleName = 'ovhManagerVpsDashboard';

angular
  .module(moduleName, [
    ngOvhFeatureFlipping,
    ovhManagerAdvices,
    ovhManagerIncidentBanner,
    ovhManagerBillingComponents,
    ovhManagerVpsDashboardCommitment,
    ovhManagerVpsDashboardCancelCommitment,
    ovhManagerVpsDashboardCancelResiliation,
    ovhManagerVpsDashboardRebuild,
    ovhManagerVpsDashboardResiliation,
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
    vpsStateInfo,
    'ui.router',
  ])
  .service('vpsUpgradeTile', vpsUpgradeTileService)
  .service('VpsMigrationService', vpsMigrationService)
  .component(component.name, component)
  .component(vpsTileStatusItem.name, vpsTileStatusItem)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
