import angular from 'angular';

import datacenterManageNsxEdgesComponent from '../../../../components/dedicated-cloud/datacenter/dashboard/manage-nsx-edges';
import routing from './dedicatedCloud-datacenter-manage-nsx.routing';

const moduleName = 'ovhManagerDedicatedCloudDatacenterManageNsxEdges';

angular
  .module(moduleName, [datacenterManageNsxEdgesComponent])
  .constant(
    'NSX_TRACKING_PREFIX',
    'dedicated::dedicatedCloud::details::datacenter::details::dashboard::nsx',
  )
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
