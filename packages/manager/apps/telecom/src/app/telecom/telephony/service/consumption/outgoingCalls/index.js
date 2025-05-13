import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import controller from './outgoing-calls.controller';
import template from './outgoing-calls.html';

const moduleName = 'ovhManagerTelecomTelephonyServiceConsumptionOutgoingCalls';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .controller('TelecomTelephonyServiceConsumptionOutgoingCallsCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'app/telecom/telephony/service/consumption/outgoingCalls/outgoing-calls.html',
        template,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./../translations ./translations */);

export default moduleName;
