import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import membersComponents from '../../../../../../../components/telecom/telephony/alias/members';

import routing from './ovh-pabx.routing';

const moduleName = 'ovhManagerTelecomTelephonyAliasConfigurationQueuesOvhPabx';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    membersComponents,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./hunting-sounds/translations */);

export default moduleName;
