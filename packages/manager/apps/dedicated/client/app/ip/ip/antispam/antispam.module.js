import routing from './antispam.routing';

const moduleName = 'ovhManagerIpDashboardAntispam';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
