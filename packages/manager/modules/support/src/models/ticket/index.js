import '@ovh-ux/ng-translate-async-loader';
import angular from 'angular';
import 'angular-translate';

import TicketMessage from './message';
import TicketService from './ticket.service';

const moduleName = 'ovhManagerSupportModelsTicket';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    TicketMessage,
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('ticketService', TicketService);

export default moduleName;
