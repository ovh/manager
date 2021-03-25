import routing from './logs.routing';

const moduleName = 'ovhManagerPrivateDatabaseLogs';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
