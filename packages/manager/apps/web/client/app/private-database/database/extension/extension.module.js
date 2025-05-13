import routing from './extension.routing';

const moduleName = 'ovhManagerPrivateDatabaseDatabaseExtension';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
