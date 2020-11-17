import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import modal from './modal';
import controller from './service.controller';
import template from './service.html';

const moduleName = 'ovhManagerTelecomPackXdslModemService';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    modal,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .controller('XdslModemServiceCtrl', controller)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'app/telecom/pack/xdsl/modem/service/service.html',
        template,
      );
    },
  );

export default moduleName;
