import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import controller from './dmz.controller';
import template from './dmz.html';
import routing from './dmz.routing';

const moduleName = 'ovhManagerTelecomPackXdslModemDmz';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .controller('XdslModemDmzCtrl', controller)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put('app/telecom/pack/xdsl/modem/dmz/dmz.html', template);
    },
  );

export default moduleName;
