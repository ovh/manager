import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import controller from './lan.controller';
import factory from './lan.factory';
import template from './lan.html';

const moduleName = 'ovhManagerTelecomPackXdslModemLan';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .controller('XdslModemLanCtrl', controller)
  .factory('PackXdslModemLanObject', factory)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'app/telecom/pack/xdsl/modem/router/lan/lan.html',
        template,
      );
    },
  );

export default moduleName;
