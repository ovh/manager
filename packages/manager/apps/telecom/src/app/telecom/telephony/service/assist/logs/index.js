import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import controller from './logs.controller';
import template from './logs.html';

const moduleName = 'ovhManagerTelecomTelephonyServiceAssistLogs';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .controller('TelecomTelephonyServiceAssistLogsCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'app/telecom/telephony/service/assist/logs/logs.html',
        template,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./../translations ./translations */);

export default moduleName;
