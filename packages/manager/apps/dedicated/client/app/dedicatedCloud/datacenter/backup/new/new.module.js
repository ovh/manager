import angular from 'angular';

import datacenterBackupNewComponent from '../../../../components/dedicated-cloud/datacenter/backup/new';
import routing from './new.routing';

const moduleName = 'ovhManagerDedicatedCloudDatacenterBackupNew';

angular.module(moduleName, [datacenterBackupNewComponent]).config(routing);

export default moduleName;
