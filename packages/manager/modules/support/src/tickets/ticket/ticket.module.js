import angular from 'angular';

import managerCore from '@ovh-ux/manager-core';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import 'ovh-ui-angular';

import message from './message';

import component from './ticket.component';
import { state } from './ticket.routing';
import service from './ticket.service';

import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit/dist/oui-olt.css';

const moduleName = 'ovhManagerSupportTicket';

angular
  .module(moduleName, [
    angularTranslate,
    managerCore,
    message,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .component(component.name, component)
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(state.name, state);
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('ticketService', service);

export default moduleName;
