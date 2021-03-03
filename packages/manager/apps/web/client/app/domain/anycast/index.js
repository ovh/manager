import component from './domain-dns-anycast.component';
import routing from './domain-dns-anycast.state';

const moduleName = 'domainAnycast';

angular
  .module(moduleName, [])
  .component('domainAnycast', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
