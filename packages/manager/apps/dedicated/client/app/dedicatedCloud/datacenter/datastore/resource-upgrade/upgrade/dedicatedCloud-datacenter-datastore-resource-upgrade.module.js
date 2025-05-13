import angular from 'angular';

import datacenterDatastoreResourceUpgradeComponent from '../../../../../components/dedicated-cloud/resource/upgrade';
import routing from './dedicatedCloud-datacenter-datastore-resource-upgrade.routes';

const moduleName = 'dedicatedCloudDatacenterDatastoreResourceUpgradeModule';

angular
  .module(moduleName, [datacenterDatastoreResourceUpgradeComponent])
  .config(routing);

export default moduleName;
