import routing from './runtimes.routing';

const moduleName = 'ovhManagerHostingRuntimes';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
