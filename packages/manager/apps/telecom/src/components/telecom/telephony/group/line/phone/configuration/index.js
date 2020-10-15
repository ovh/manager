import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import extension from './extension';
import userInterface from './userInterface';

import component from './configuration.component';

const moduleName =
  'ovhManagerTelecomComponentsTelecomTelephonyGroupLinePhoneConfiguration';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    extension,
    userInterface,
  ])
  .component('linePhoneConfiguration', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
