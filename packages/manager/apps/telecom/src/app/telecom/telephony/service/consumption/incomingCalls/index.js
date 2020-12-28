import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import controller from './incoming-calls.controller';
import template from './incoming-calls.html';

const moduleName = 'ovhManagerTelecomTelephonyServiceConsumptionIncomingCalls';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .controller('TelecomTelephonyServiceConsumptionIncomingCallsCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'app/telecom/telephony/service/consumption/incomingCalls/incoming-calls.html',
        template,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./../translations ./translations */);

export default moduleName;
