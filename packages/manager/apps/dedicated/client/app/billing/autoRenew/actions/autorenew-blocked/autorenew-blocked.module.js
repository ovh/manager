import angular from 'angular';
import 'angular-translate';
import atInternet from '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './autorenew-blocked.component';
import routing from './autorenew-blocked.routing';

const moduleName = 'ovhManagerBillingAutorenewBlocked';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    atInternet,
  ])
  .config(routing)
  .component('billingAutorenewBlocked', component);

export default moduleName;
