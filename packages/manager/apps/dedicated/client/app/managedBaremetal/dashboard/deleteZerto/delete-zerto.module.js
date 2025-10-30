import angular from 'angular';

import datacenterZertoDeleteComponent from '../../../components/dedicated-cloud/datacenter/zerto/summary/delete';
import zerto from '../../../components/dedicated-cloud/datacenter/zerto';
import routing from './delete-zerto.routing';

const moduleName = 'managedBaremetalDeleteZertoModule';

angular
  .module(moduleName, [zerto, datacenterZertoDeleteComponent])
  .config(routing);

export default moduleName;
