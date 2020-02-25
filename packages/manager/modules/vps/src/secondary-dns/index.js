import angular from 'angular';
import '@uirouter/angularjs';

import component from './vps-secondary-dns.component';
import routing from './vps-secondary-dns.routing';

import addSecondaryDns from './add';
import deleteSecondaryDns from './delete';

const moduleName = 'ovhManagerVpsSecondaryDns';

angular
  .module(moduleName, [addSecondaryDns, deleteSecondaryDns, 'ui.router'])
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
