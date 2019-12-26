import angular from 'angular';
import '@uirouter/angularjs';

import routing from './add-secondary-dns.routing';
import component from './add-secondary-dns.component';

const moduleName = 'vpsSecondaryDnsAddModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('vpsSecondaryDnsAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
