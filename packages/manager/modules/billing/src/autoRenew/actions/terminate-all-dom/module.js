import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import component from './component';
import routing from './routing';

import './style.less';

const moduleName = 'ovhManagerBillingAutorenewTerminateAllDom';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .component('billingAutorenewTerminateAllDom', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
