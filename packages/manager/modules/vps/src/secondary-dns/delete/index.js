import angular from 'angular';
import '@uirouter/angularjs';

import routing from './delete-secondary-dns.routing';
import component from './delete-secondary-dns.component';

const moduleName = 'vpsSecondaryDnsDeleteModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('vpsSecondaryDnsDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
