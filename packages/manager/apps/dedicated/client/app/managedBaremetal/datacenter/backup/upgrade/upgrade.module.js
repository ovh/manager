import angular from 'angular';

import datacenterBackupUpgradeComponent from '../../../../components/dedicated-cloud/datacenter/backup/upgrade';
import routing from './upgrade.routing';

const moduleName = 'managedBaremetalDatacenterBackupUpgrade';

angular.module(moduleName, [datacenterBackupUpgradeComponent]).config(routing);

export default moduleName;
