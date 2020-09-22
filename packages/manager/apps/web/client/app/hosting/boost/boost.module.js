import routing from './boost.routing';

const moduleName = 'ovhManagerHostingBoost';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
