import routing from './list.routing';

const moduleName = 'ovhManagerPrivateDatabaseDatabaseArchiveList';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
