import angular from 'angular';

import datacenterBackupComponent from '../../../components/dedicated-cloud/datacenter/backup';
import deleteBackup from './delete';
import routing from './backup.routing';
import minimumHosts from './minimumHosts';
import newBackup from './new';
import splaLicence from './splaLicence';
import upgrade from './upgrade';

const moduleName = 'ovhManagerDedicatedCloudDatacenterBackup';

angular
  .module(moduleName, [
    datacenterBackupComponent,
    deleteBackup,
    minimumHosts,
    newBackup,
    splaLicence,
    upgrade,
  ])
  .config(routing);

export default moduleName;
