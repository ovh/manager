import detailComponent from './detail/vps-detail.component';
import headerComponent from './header/vps-header.component';
import routing from './vps.routing';

import ovhManagerVpsAdditionnalDisk from './additional-disk';
import ovhManagerVpsBackupStorage from './backup-storage';
import ovhManagerVpsCloudDatabase from './cloud-database';
import ovhManagerVpsDashboard from './dashboard';
import ovhManagerVpsMonitoring from './monitoring';
import ovhManagerVpsSecondaryDns from './secondary-dns';
import ovhManagerVpsSnapshot from './snapshot';
import ovhManagerVpsUpgrade from './upgrade';
import ovhManagerVpsVeeam from './veeam';
import ovhManagerVpsWindows from './windows';

const moduleName = 'ovhManagerVps';

angular
  .module(moduleName, [
    ovhManagerVpsAdditionnalDisk,
    ovhManagerVpsBackupStorage,
    ovhManagerVpsCloudDatabase,
    ovhManagerVpsDashboard,
    ovhManagerVpsMonitoring,
    ovhManagerVpsSecondaryDns,
    ovhManagerVpsSnapshot,
    ovhManagerVpsUpgrade,
    ovhManagerVpsVeeam,
    ovhManagerVpsWindows,
  ])
  .component(detailComponent.name, detailComponent)
  .component(headerComponent.name, headerComponent)
  .config(routing);

export default moduleName;
