import angular from 'angular';

import DatacenterZertoSummaryComponent from '../../../../components/dedicated-cloud/datacenter/zerto/summary';
import deleteZerto from './delete';
import routing from './summary.routing';

const moduleName = 'managedBaremetalDatacenterZertoSummaryModule';

angular
  .module(moduleName, [DatacenterZertoSummaryComponent, deleteZerto])
  .config(routing);

export default moduleName;
