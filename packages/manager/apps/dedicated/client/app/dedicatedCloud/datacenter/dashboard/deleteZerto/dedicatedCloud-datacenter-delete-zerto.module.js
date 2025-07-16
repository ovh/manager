import angular from 'angular';

import datacenterDeleteZertoComponent from '../../../../components/dedicated-cloud/datacenter/zerto/summary/delete';
import zerto from '../../../../components/dedicated-cloud/datacenter/zerto';
import routing from './dedicatedCloud-datacenter-delete-zerto.routes';

const moduleName = 'ovhManagerDedicatedCloudDatacenterDeleteZerto';

angular
  .module(moduleName, [datacenterDeleteZertoComponent, zerto])
  .config(routing);

export default moduleName;
