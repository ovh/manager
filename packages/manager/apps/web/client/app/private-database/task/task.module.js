import routing from './task.routing';

const moduleName = 'ovhManagerPrivateDatabaseTask';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
