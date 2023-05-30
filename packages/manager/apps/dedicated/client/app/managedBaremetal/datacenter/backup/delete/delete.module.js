import angular from 'angular';

import datacenterBackupDeleteComponent from '../../../../components/dedicated-cloud/datacenter/backup/delete';
import routing from './delete.routing';

const moduleName = 'managedBaremetalDatacenterBackupDelete';

angular.module(moduleName, [datacenterBackupDeleteComponent]).config(routing);

export default moduleName;
