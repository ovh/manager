import angular from 'angular';

import ovhUxNgOvhOtrs from '@ovh-ux/ng-ovh-otrs';
import ovhUxNgTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouterAngularJs from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';

import ticket from './ticket';

import component from './tickets.component';
import { registerState } from './tickets.routing';
import ticketMessageService from './ticket/message/message.service';
import ticketService from './ticket/ticket.service';
import ticketsService from './tickets.service';

const moduleName = 'ovhManagerSupportTickets';

angular
  .module(moduleName, [
    angularTranslate,
    'oui',
    ovhUxNgOvhOtrs,
    ovhUxNgTranslateAsyncLoader,
    ticket,
    uiRouterAngularJs,
  ])
  .component(component.name, component)
  .config(registerState)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('ticketService', ticketService)
  .service('ticketMessageService', ticketMessageService)
  .service('ticketsService', ticketsService);

export default moduleName;
