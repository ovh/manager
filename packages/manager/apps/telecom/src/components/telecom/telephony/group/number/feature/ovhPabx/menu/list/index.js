import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import component from './list.component';

const moduleName =
  'ovhManagerTelecomComponentsTelecomTelephonyGroupNumberFeatureOvhPabxMenuList';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .component('telephonyNumberOvhPabxMenuList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
