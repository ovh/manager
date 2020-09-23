import routing from './metrics.routing';

const moduleName = 'ovhManagerPrivateDatabaseMetrics';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
