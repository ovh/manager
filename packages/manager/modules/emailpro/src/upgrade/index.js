import angular from 'angular';

import routing from './upgrade.routing';

const moduleName = 'emailProMXPlanUpgrade';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
