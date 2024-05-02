import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import routing from './softphone.routing';
import component from './softphone.component';
import softphoneService from './softphone.service';
import addDeviceModule from './addDevice';
import './softphone.scss';

const moduleName = 'ovhManagerTelecomTelephonyLineSoftphone';

angular
  .module(moduleName, [
    addDeviceModule,
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('ovhManagerTelecomTelephonyLineSoftphoneComponent', component)
  .service('softphoneService', softphoneService)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
