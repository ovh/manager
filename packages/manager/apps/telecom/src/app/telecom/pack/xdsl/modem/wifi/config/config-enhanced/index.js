import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';
import wifiFeatures from './wifi-features';
import radioSettings from './radio-settings';
import ssidSettings from './ssid-settings';

import component from './config-enhanced.component';
import service from './config-enhanced.service';

const moduleName = 'ovhManagerTelecomPackConfigEnhancedWifi';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    wifiFeatures,
    radioSettings,
    ssidSettings,
  ])
  .component('wifiConfigEnhanced', component)
  .service('wifiConfigEnhancedService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
