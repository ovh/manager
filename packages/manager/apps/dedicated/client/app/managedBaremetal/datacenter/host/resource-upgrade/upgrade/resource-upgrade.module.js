import angular from 'angular';

import datacenterHostResourceUpgradeComponent from '../../../../../components/dedicated-cloud/resource/upgrade';
import routing from './resource-upgrade.routes';

const moduleName = 'managedBaremetalDatacenterHostResourceUpgradeModule';

angular
  .module(moduleName, [datacenterHostResourceUpgradeComponent])
  .config(routing);

export default moduleName;
