import angular from 'angular';

import deleteDrp from './delete';
import routing from './summary.routing';

const moduleName = 'managedBaremetalDatacenterDrpSummaryModule';

angular.module(moduleName, [deleteDrp]).config(routing);

export default moduleName;
