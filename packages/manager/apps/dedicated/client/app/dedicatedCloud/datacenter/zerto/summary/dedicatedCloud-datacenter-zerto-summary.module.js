import angular from 'angular';

import DatacenterZertoSummaryComponent from '../../../../components/dedicated-cloud/datacenter/zerto/summary';
import deleteZerto from './delete';
import routing from './dedicatedCloud-datacenter-zerto-summary.routing';

const moduleName = 'ovhManagerDedicatedCloudDatacenterZertoSummaryModule';

angular
  .module(moduleName, [DatacenterZertoSummaryComponent, deleteZerto])
  .config(routing);

export default moduleName;
