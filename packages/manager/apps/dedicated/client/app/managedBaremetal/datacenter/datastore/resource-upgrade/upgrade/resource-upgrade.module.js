import angular from 'angular';

import datacenterDatastoreResourceUpgradeComponent from '../../../../../components/dedicated-cloud/resource/upgrade';
import routing from './resource-upgrade.routes';

const moduleName = 'managedBaremetalDatacenterDatastoreResourceUpgradeModule';

angular
  .module(moduleName, [datacenterDatastoreResourceUpgradeComponent])
  .config(routing);

export default moduleName;
