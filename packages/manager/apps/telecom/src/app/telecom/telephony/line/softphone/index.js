import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import routing from './softphone.routing';
import component from './softphone.component';
import SoftphoneService from './softphone.service';

const moduleName = 'ovhManagerTelecomTelephonyLineSoftphone';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('ovhManagerTelecomTelephonyLineSoftphoneComponent', component)
  .config(routing)
  .service('SoftphoneService', SoftphoneService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
