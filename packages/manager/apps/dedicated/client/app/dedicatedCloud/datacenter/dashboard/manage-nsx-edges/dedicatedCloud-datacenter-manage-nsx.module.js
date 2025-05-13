import angular from 'angular';

import datacenterManageNsxEdgesComponent from '../../../../components/dedicated-cloud/datacenter/dashboard/manage-nsx-edges';
import routing from './dedicatedCloud-datacenter-manage-nsx.routing';

const moduleName = 'ovhManagerDedicatedCloudDatacenterManageNsxEdges';

angular
  .module(moduleName, [datacenterManageNsxEdgesComponent])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
