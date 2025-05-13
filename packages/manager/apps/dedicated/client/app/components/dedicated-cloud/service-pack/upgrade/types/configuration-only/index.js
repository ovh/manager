import steps from './configuration-only.steps';

const moduleName = 'ovhManagerPccServicePackUpgradeConfigurationOnlyComponent';

angular
  .module(moduleName, [...steps])
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
