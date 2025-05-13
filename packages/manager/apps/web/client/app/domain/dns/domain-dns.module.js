import routing from './domain-dns.state';

const moduleName = 'ovhManagerWebDomainDnsModule';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
