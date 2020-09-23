import routing from './grants.routing';

const moduleName = 'ovhManagerPrivateDatabaseUserGrants';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
