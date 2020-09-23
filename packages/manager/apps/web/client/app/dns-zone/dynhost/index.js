import routing from './dns-zone-dynhost.routing';

const moduleName = 'ovhManagerWebDomainZoneDynHost';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
