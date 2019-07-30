import '@ovh-ux/ng-translate-async-loader';
import angular from 'angular';
import 'angular-translate';

import TicketMessageService from './message.service';

const moduleName = 'ovhManagerSupportModelsTicketMessage';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('ticketMessageService', TicketMessageService);

export default moduleName;
