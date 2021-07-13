import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'angular-ui-bootstrap';

import component from './history-legacy.component';

const moduleName = 'ovhManagerPciProjectBillingHistoryLegacy';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.bootstrap',
    'ui.router',
  ])
  .component('pciProjectBillingHistoryLegacy', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
