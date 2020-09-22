import routing from './task.routing';

const moduleName = 'ovhManagerHostingTask';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
