import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';
import wifiConfigLegacyModal from './modal';
import component from './config-legacy.component';

const moduleName = 'ovhManagerTelecomPackConfigLegacyWifi';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    wifiConfigLegacyModal,
  ])
  .component('wifiConfigLegacy', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
