import angular from 'angular';

import datacenterBackupMinimumHostsComponent from '../../../../components/dedicated-cloud/datacenter/backup/minimumHosts';
import routing from './minimumHosts.routing';

const moduleName = 'ovhManagerDedicatedCloudDatacenterBackupMinimumHosts';

angular
  .module(moduleName, [datacenterBackupMinimumHostsComponent])
  .config(routing);

export default moduleName;
