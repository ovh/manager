import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';

import choice from './choice';
import finalize from './finalize';
import resume from './resume';
import shipping from './shipping';

import component from './accessories.component';
import routing from './accessories.routing';

const moduleName = 'ovhTelecomLinePhoneAccessories';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    uiRouter,
    angularTranslate,
    'oui',
    choice,
    finalize,
    resume,
    shipping,
  ])
  .component('accessories', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
