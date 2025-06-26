import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import ovhManagerTelecomPackConfigActivationState from '../activation-state-display';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import component from './ssid-settings.component';

const moduleName = 'ovhManagerTelecomPackConfigSSIDSettings';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    ovhManagerTelecomPackConfigActivationState,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
  ])
  .component('ssidSettings', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
