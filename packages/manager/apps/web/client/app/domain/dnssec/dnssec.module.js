import routing from './domain-dnssec.state';

const moduleName = 'ovhManagerWebDomainDnsSecModule';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
