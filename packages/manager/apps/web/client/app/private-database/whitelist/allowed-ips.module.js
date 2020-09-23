import routing from './allowed-ips.routing';

const moduleName = 'ovhManagerPrivateDatabaseAllowedIPs';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
