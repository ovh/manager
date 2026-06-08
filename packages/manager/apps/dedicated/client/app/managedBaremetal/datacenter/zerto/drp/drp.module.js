import angular from 'angular';

import DatacenterZertoDrpComponent from '../../../../components/dedicated-cloud/datacenter/zerto/drp';
import routing from './drp.routing';

const moduleName = 'managedBaremetalDatacenterZertoDrpModule';

angular
  .module(moduleName, [DatacenterZertoDrpComponent])
  .config(routing);

export default moduleName;
