import angular from 'angular';
import '@uirouter/angularjs';
import routing from './routes';

const moduleName = 'dedicatedCloudUpgradeRangeLazyloading';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
