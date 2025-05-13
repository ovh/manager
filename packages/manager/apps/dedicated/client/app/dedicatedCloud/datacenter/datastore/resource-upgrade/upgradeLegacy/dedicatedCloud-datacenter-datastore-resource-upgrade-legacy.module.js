import angular from 'angular';

import datacenterDatastoreResourceUpgradeLegacyComponent from '../../../../../components/dedicated-cloud/resource/upgradeLegacy';
import routing from './dedicatedCloud-datacenter-datastore-resource-upgrade-legacy.routes';

const moduleName =
  'dedicatedCloudDatacenterDatastoreResourceUpgradeLegacyModule';

angular
  .module(moduleName, [datacenterDatastoreResourceUpgradeLegacyComponent])
  .config(routing);

export default moduleName;
