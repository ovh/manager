import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import directive from './sva-generator.directive';

import './sva-generator.less';

const moduleName =
  'ovhManagerTelecomComponentsTelecomTelephonyAliasSvaGenerator';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .directive('svaGenerator', directive)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
