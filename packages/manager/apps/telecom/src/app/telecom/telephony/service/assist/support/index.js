import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import controller from './support.controller';
import template from './support.html';

const moduleName = 'ovhManagerTelecomTelephonyServiceAssistLSupport';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .controller('TelecomTelephonyServiceAssistSupportCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'app/telecom/telephony/service/assist/support/support.html',
        template,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./../translations ./translations */);

export default moduleName;
