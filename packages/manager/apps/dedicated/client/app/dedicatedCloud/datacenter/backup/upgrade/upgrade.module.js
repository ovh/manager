import angular from 'angular';

import datacenterBackupUpgradeComponent from '../../../../components/dedicated-cloud/datacenter/backup/upgrade';
import routing from './upgrade.routing';

const moduleName = 'ovhManagerDedicatedCloudDatacenterBackupUpgrade';

angular.module(moduleName, [datacenterBackupUpgradeComponent]).config(routing);

export default moduleName;
