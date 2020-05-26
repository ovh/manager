import angular from 'angular';
import '@ovh-ux/ng-at-internet';

import routing from './delete.routing';

import component from './delete.component';
import service from '../serving.service';

const moduleName = 'ovhManagerPciServingDelete';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    'ngAtInternet',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerPciServingDelete', component)
  .service('ovhManagerPciServing', service);

export default moduleName;
