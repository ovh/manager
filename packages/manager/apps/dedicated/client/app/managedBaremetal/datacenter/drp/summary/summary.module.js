import angular from 'angular';

import datacenterDrpSummaryComponent from '../../../../components/dedicated-cloud/datacenter/drp/summary';
import deleteDrp from './delete';
import routing from './summary.routing';

const moduleName = 'managedBaremetalDatacenterDrpSummaryModule';

angular
  .module(moduleName, [datacenterDrpSummaryComponent, deleteDrp])
  .config(routing);

export default moduleName;
