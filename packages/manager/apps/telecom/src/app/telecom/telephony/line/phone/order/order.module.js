import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';

import choice from './choice';
import rma from './rma';
import shipping from './shipping';
import summary from './summary';

import component from './order.component';
import routing from './order.routing';

const moduleName = 'ovhTelecomLinePhoneOrder';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    uiRouter,
    angularTranslate,
    'oui',
    choice,
    rma,
    shipping,
    summary,
  ])
  .component('order', component)
  .config(routing);

export default moduleName;
