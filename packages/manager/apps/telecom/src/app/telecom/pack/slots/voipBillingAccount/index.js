import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import controller from './voipBillingAccount.controller';
import template from './voipBillingAccount.html';

const moduleName = 'ovhManagerTelecomPackVoipBillingAccount';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .controller('PackVoipBillingAccountCtrl', controller)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'app/telecom/pack/slots/voipBillingAccount/voipBillingAccount.html',
        template,
      );
    },
  );

export default moduleName;
