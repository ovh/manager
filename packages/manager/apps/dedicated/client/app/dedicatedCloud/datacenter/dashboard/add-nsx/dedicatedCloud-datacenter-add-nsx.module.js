import angular from 'angular';

import datacenterManageAddNsxComponent from '../../../../components/dedicated-cloud/datacenter/dashboard/add-nsx';
import routing from './dedicatedCloud-datacenter-add-nsx.routing';

const moduleName = 'ovhManagerDedicatedCloudDatacenterAddNsx';

angular
  .module(moduleName, [datacenterManageAddNsxComponent])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
