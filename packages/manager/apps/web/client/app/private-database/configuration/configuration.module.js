import routing from './configuration.routing';

const moduleName = 'ovhManagerPrivateDatabaseConfiguration';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
