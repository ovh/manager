import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import directive from './choice.directive';

import './choice.less';

const moduleName = 'ovhManagerTelecomComponentsTelecomTelephonyServiceChoice';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .directive('voipServiceChoice', directive)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
