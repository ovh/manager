import angular from 'angular';
import 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import uiRouter from '@uirouter/angularjs';
import '@ovh-ux/ui-kit';

import component from './add-credits.component';
import routing from './add-credits.routing';

const moduleName = 'ovhManagerBillingPaymentCreditsAdd';

angular
  .module(moduleName, [
    ngAtInternet,
    ngUiRouterLayout,
    'oui',
    'pascalprecht.translate',
    uiRouter,
  ])
  .config(routing)
  .component('billingPaymentCreditsAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
