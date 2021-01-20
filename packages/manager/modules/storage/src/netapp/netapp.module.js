import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';

import component from './netapp.component';
import share from './share';

import routing from './netapp.routing';
import service from './netapp.service';

const moduleName = 'ovhManagerStorageNetapp';

angular
  .module(moduleName, ['ui.router', share])
  .config(routing)
  .component('netapp', component)
  .service('NetappService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
