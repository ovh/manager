import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import controller from './contact.controller';
import template from './contact.html';

const moduleName = 'ovhManagerTelecomTelephonyServiceContact';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .controller('TelecomTelephonyServiceContactCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'app/telecom/telephony/service/contact/contact.html',
        template,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
