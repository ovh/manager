import angular from 'angular';

import datacenterHostResourceUpgradeLegacyComponent from '../../../../../components/dedicated-cloud/resource/upgradeLegacy';
import routing from './dedicatedCloud-datacenter-host-resource-upgrade-legacy.routes';

const moduleName = 'dedicatedCloudDatacenterHostResourceUpgradeLegacyModule';

angular
  .module(moduleName, [datacenterHostResourceUpgradeLegacyComponent])
  .config(routing);

export default moduleName;
