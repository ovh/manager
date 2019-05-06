import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import estimate from './estimate';
import history from './history';
import routing from './billing.routing';
import service from './billing.service';

const moduleName = 'ovhManagerPciProjectBilling';

angular
  .module(moduleName, [
    estimate,
    history,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .service('CloudProjectBilling', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
