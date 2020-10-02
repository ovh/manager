import routing from './organisation.routing';

const moduleName = 'ovhManagerIpDashboardOrganisation';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
