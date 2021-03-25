import routing from './dump.routing';

const moduleName = 'ovhManagerPrivateDatabaseDatabaseDump';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
