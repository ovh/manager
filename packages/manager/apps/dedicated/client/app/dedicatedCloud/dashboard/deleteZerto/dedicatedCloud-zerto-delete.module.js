import angular from 'angular';

import datacenterZertoDeleteComponent from '../../../components/dedicated-cloud/datacenter/zerto/summary/delete';
import zerto from '../../../components/dedicated-cloud/datacenter/zerto';
import routing from './dedicatedCloud-zerto-delete.routing';

const moduleName = 'dedicatedCloudDeleteZertoModule';

angular
  .module(moduleName, [zerto, datacenterZertoDeleteComponent])
  .config(routing);

export default moduleName;
