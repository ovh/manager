import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import controller from './bdhcp.controller';
import template from './bdhcp.html';
import factory from './bdhcp.factory';

const moduleName = 'ovhManagerTelecomPackXdslModemDhcpBdhcp';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .controller('XdslModemDhcpBdhcpCtrl', controller)
  .factory('PackXdslModemDhcpBdhcpObject', factory)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'app/telecom/pack/xdsl/modem/router/dhcp/bdhcp/bdhcp.html',
        template,
      );
    },
  );

export default moduleName;
