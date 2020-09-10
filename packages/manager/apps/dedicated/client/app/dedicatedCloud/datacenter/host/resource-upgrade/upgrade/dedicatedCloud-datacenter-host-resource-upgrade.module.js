import angular from 'angular';

import datacenterHostResourceUpgradeComponent from '../../../../../components/dedicated-cloud/resource/upgrade';
import routing from './dedicatedCloud-datacenter-host-resource-upgrade.routes';

const moduleName = 'dedicatedCloudDatacenterHostResourceUpgradeModule';

angular
  .module(moduleName, [datacenterHostResourceUpgradeComponent])
  .config(routing);

export default moduleName;
