import angular from 'angular';
import 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import component from './activation.component';
import routing from './activation.routing';

const moduleName = 'ovhManagerBillingAutorenewActivation';

angular
  .module(moduleName, [
    ngAtInternet,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('billingAutorenewActivation', component);

export default moduleName;
