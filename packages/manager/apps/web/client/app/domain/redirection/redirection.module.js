import routing from './domain-redirection.state';

const moduleName = 'ovhManagerWebDomainRedirectionModule';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
