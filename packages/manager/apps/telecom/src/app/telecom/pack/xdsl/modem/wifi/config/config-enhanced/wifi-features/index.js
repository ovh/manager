import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import component from './wifi-features.component';

const moduleName = 'ovhManagerTelecomPackConfigWifiFeatures';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
  ])
  .component('wifiFeatures', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
