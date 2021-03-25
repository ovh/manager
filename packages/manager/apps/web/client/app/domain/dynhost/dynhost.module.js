import routing from './domain-dynhost.state';

const moduleName = 'ovhManagerWebDomainDynhostModule';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
