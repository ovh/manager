import component from './activate.component';
import routing from './activate.routing';

const moduleName = 'ovhManagerWebDomainZoneActivate';

angular
  .module(moduleName, [])
  .config(routing)
  .component('domainZoneActivate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
