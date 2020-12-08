import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import service from './comfort-exchange.service';
import xdslAccessComfortExchange from './comfort-exchange.component';
import routing from './comfort-exchange.routing';

const moduleName = 'ovhManagerTelecomPackXdslAccessComfortExchange';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .component('xdslAccessComfortExchange', xdslAccessComfortExchange)
  .config(routing)
  .service('XdslAccessComfortExchangeService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
