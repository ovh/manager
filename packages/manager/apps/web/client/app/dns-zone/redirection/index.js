import routing from './dns-zone-redirection.routing';

const moduleName = 'ovhManagerWebDomainZoneRedirection';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
