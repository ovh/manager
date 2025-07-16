import angular from 'angular';

import datacenterDeleteZertoComponent from '../../../../components/dedicated-cloud/datacenter/zerto/summary/delete';
import zerto from '../../../../components/dedicated-cloud/datacenter/zerto';
import routing from './delete-zerto.routes';

const moduleName = 'managedBaremetalDatacenterDeleteZerto';

angular
  .module(moduleName, [datacenterDeleteZertoComponent, zerto])
  .config(routing);

export default moduleName;
