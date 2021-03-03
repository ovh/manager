import routing from './multisite.routing';

const moduleName = 'ovhManagerHostingMultisite';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
