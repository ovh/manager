import routing from './envvars.routing';

const moduleName = 'ovhManagerHostingEnvvars';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
