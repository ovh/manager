import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import telephonyNumberComponent from '../../../../../components/telecom/telephony/group/number';
import serviceChoicePopoverComponent from '../../../../../components/telecom/telephony/service/choice-popover';

import agents from './agents';
import feature from './feature';
import ovhPabx from './ovhPabx';
import queues from './queues';
import recordsOvhPabx from './records/ovhPabx';
import scheduler from './scheduler';
import stats from './stats';

import routing from './configuration.routing';

const moduleName = 'ovhManagerTelecomTelephonyAliasConfiguration';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    telephonyNumberComponent,
    serviceChoicePopoverComponent,
    agents,
    feature,
    ovhPabx,
    queues,
    recordsOvhPabx,
    scheduler,
    stats,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
