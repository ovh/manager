import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';

import newTicket from './new-ticket';
import ticket from './ticket';

import component from './tickets.component';
import { state } from './tickets.routing';
import ticketMessageService from './ticket/message/message.service';
import ticketService from './ticket/ticket.service';
import ticketsService from './tickets.service';

import '@ovh-ux/ui-kit/dist/css/oui.css';

const moduleName = 'ovhManagerSupportTickets';

angular
  .module(moduleName, [
    angularTranslate,
    newTicket,
    ngTranslateAsyncLoader,
    'oui',
    ticket,
    uiRouter,
  ])
  .component(component.name, component)
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(state.name, state);
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('ticketService', ticketService)
  .service('ticketMessageService', ticketMessageService)
  .service('ticketsService', ticketsService);

export default moduleName;
