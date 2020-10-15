import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';

import associateDeviceComponent from '../../../../../../components/telecom/telephony/associateDevice';

import choice from './choice';
import rma from './rma';
import shipping from './shipping';
import summary from './summary';

import component from './order.component';
import routing from './order.routing';

const moduleName = 'ovhManagerTelecomTelephonyLinePhoneOrder';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    uiRouter,
    angularTranslate,
    'oui',
    associateDeviceComponent,
    choice,
    rma,
    shipping,
    summary,
  ])
  .component('order', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
