import routing from './module.routing';

const moduleName = 'ovhManagerHostingModule';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
