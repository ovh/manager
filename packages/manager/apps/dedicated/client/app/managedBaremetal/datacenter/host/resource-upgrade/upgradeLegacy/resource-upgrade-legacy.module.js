import angular from 'angular';

import datacenterHostResourceUpgradeLegacyComponent from '../../../../../components/dedicated-cloud/resource/upgradeLegacy';
import routing from './resource-upgrade-legacy.routes';

const moduleName = 'managedBaremetalDatacenterHostResourceUpgradeLegacyModule';

angular
  .module(moduleName, [datacenterHostResourceUpgradeLegacyComponent])
  .config(routing);

export default moduleName;
