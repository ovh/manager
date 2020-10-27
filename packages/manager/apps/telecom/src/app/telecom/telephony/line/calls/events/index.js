import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import schedulerComponents from '../../../../../../components/telecom/telephony/scheduler';

import routing from './events.routing';

const moduleName = 'ovhManagerTelecomTelephonyLineCallsEvents';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    'ovh-api-services',
    schedulerComponents,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
