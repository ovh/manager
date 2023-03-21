import angular from 'angular';
import '@uirouter/angularjs';
import ovhManagerAdvices from '@ovh-ux/manager-advices';
import ovhManagerBillingComponents from '@ovh-ux/manager-billing-components';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import component from './vps-dashboard.component';
import routing from './vps-dashboard.routing';

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
import ovhManagerVpsDashboardSnapshotDelete from './modal/snapshot-delete';
import ovhManagerVpsDashboardSnapshotRestore from './modal/snapshot-restore';
import ovhManagerVpsDashboardSnapshotDownload from './modal/snapshot-download';
import ovhManagerVpsDashboardSnapshotTake from './modal/snapshot-take';
import ovhManagerVpsDashboardTerminateOption from './modal/terminate-option';
import ovhManagerVpsDashboardTerminate from './terminate';
import ovhManagerVpsDashboardAdditionalDiskUpgrade from './additional-disk/upgrade';
import ovhManagerVpsDashboardTile from './tile';
import vpsStateInfo from './components/vps-state-info';
import vpsAnnouncementBanner from './components/vps-announcement-banner';
import ovhManagerVpsDashboardMigrate from './migrate';

const moduleName = 'ovhManagerVpsDashboard';

angular
  .module(moduleName, [
    ngOvhFeatureFlipping,
    ovhManagerAdvices,
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
    ovhManagerVpsDashboardSnapshotDelete,
    ovhManagerVpsDashboardSnapshotRestore,
    ovhManagerVpsDashboardSnapshotDownload,
    ovhManagerVpsDashboardSnapshotTake,
    ovhManagerVpsDashboardAdditionalDiskUpgrade,
    ovhManagerVpsDashboardTile,
    vpsStateInfo,
    vpsAnnouncementBanner,
    ovhManagerVpsDashboardMigrate,
    ovhManagerVpsDashboardTerminateOption,
    'ui.router',
  ])
  .component(component.name, component)
  .component(vpsTileStatusItem.name, vpsTileStatusItem)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
