import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import controller from './management.controller';
import template from './management.html';
import service from './management.service';

const moduleName = 'ovhManagerTelecomTelephonyServiceVoicemailManagement';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'oui',
  ])
  .controller('TelecomTelephonyServiceVoicemailManagementCtrl', controller)
  .service('VoicemailManagmentService', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'app/telecom/telephony/service/voicemail/management/management.html',
        template,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
