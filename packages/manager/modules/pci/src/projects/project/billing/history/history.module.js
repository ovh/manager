import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'angular-ui-bootstrap';

import component from './history.component';
import routing from './history.routing';
import legacy from './legacy/history-legacy.module';

import './history.scss';

const moduleName = 'ovhManagerPciProjectBillingHistory';

angular
  .module(moduleName, [
    legacy,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.bootstrap',
    'ui.router',
  ])
  .component('pciProjectBillingHistory', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
