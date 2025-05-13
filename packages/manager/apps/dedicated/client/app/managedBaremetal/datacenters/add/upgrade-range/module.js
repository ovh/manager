import angular from 'angular';

import routing from './routes';
import upgradeRangeComponent from '../../../../components/dedicated-cloud/datacenters/upgrade-range';

const moduleName = 'managedBaremetalUpgradeRangeModule';

angular
  .module(moduleName, [upgradeRangeComponent])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
