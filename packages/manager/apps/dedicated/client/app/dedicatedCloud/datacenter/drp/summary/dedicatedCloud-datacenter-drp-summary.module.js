import angular from 'angular';

import deleteDrp from './delete';
import routing from './dedicatedCloud-datacenter-drp-summary.routing';

const moduleName = 'ovhManagerDedicatedCloudDatacenterDrpSummaryModule';

angular.module(moduleName, [deleteDrp]).config(routing);

export default moduleName;
