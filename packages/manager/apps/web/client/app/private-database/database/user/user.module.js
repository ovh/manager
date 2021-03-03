import routing from './user.routing';

const moduleName = 'ovhManagerPrivateDatabaseDatabaseUser';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
