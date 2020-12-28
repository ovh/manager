import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import controller from './custom-domains.controller';
import template from './custom-domains.html';

const moduleName = 'ovhManagerTelecomTelephonyServiceFaxCustomDomains';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
  ])
  .controller('TelecomTelephonyServiceFaxCustomDomainsCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'app/telecom/telephony/service/fax/customDomains/custom-domains.html',
        template,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./../translations ./translations */);

export default moduleName;
