import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';

import TicketMessageModel from '../models/ticket/message';
import TicketModel from '../models/ticket';

import component from './tickets.component';
import { registerState } from './tickets.routing';
import TicketsService from './tickets.service';

const moduleName = 'ovhManagerSupportTickets';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    TicketMessageModel,
    TicketModel,
    'ui.router',
  ])
  .component(component.name, component)
  .config(registerState)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('ticketsService', TicketsService);

export default moduleName;
