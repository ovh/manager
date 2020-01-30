import steps from './configuration-only.steps';

import { registerState } from './configuration-only.routing';

const moduleName = 'ovhManagerPccServicePackUpgradeConfigurationOnly';

angular
  .module(moduleName, [...steps])
  .config(registerState)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
