import routing from './domain-glue.state';

const moduleName = 'ovhManagerWebDomainGlueModule';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
