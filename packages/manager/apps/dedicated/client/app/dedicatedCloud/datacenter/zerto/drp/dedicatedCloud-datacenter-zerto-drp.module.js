import angular from 'angular';

import DatacenterZertoDrpComponent from '../../../../components/dedicated-cloud/datacenter/zerto/drp';
import routing from './dedicatedCloud-datacenter-zerto-drp.routing';

const moduleName = 'ovhManagerDedicatedCloudDatacenterZertoDrpModule';

angular
  .module(moduleName, [DatacenterZertoDrpComponent])
  .config(routing);

export default moduleName;
