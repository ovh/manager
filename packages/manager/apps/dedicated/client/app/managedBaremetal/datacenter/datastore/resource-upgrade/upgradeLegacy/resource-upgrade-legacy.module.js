import angular from 'angular';

import datacenterDatastoreResourceUpgradeLegacyComponent from '../../../../../components/dedicated-cloud/resource/upgradeLegacy';
import routing from './resource-upgrade-legacy.routes';

const moduleName =
  'managedBaremetalDatacenterDatastoreResourceUpgradeLegacyModule';

angular
  .module(moduleName, [datacenterDatastoreResourceUpgradeLegacyComponent])
  .config(routing);

export default moduleName;
