import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import timeConditionComponent from '../timeCondition';

import events from './events';
import filters from './filters';
import params from './params';

import directive from './scheduler.directive';

import './scheduler.less';

const moduleName = 'ovhManagerTelecomComponentsTelecomTelephonyScheduler';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    timeConditionComponent,
    events,
    filters,
    params,
  ])
  .directive('telephonyScheduler', directive)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
