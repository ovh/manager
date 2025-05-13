import angular from 'angular';

import routing from './routes';
import upgradeRangeComponent from '../../../../components/dedicated-cloud/datacenters/upgrade-range';

const moduleName = 'dedicatedCloudUpgradeRangeModule';

angular
  .module(moduleName, [upgradeRangeComponent])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
