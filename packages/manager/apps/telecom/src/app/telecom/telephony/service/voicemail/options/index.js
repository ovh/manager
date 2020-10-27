import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import controller from './options.controller';
import template from './options.html';

const moduleName = 'ovhManagerTelecomTelephonyServiceVoicemailOptions';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
  ])
  .controller('TelecomTelephonyServiceVoicemailOptionsCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'app/telecom/telephony/service/voicemail/options/options.html',
        template,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
