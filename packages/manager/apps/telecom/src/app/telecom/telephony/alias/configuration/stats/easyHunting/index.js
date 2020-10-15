import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import liveCallsComponent from '../../../../../../../components/telecom/telephony/alias/liveCalls';

import routing from './easy-hunting.routing';

const moduleName =
  'ovhManagerTelecomTelephonyAliasConfigurationStatsEasyHunting';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    liveCallsComponent,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
