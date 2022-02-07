import angular from 'angular';
import '@uirouter/angularjs';

import additionalDiskUpgrade from '../../../components/additional-disk/upgrade';

import routing from './upgrade.routing';

const moduleName = 'vpsDashboardAdditionalDiskUpgradeModule';

angular
  .module(moduleName, ['ui.router', additionalDiskUpgrade])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
