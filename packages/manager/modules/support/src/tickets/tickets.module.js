import angular from 'angular';

import component from './tickets.component';
import { registerState } from './tickets.routing';
import SupportService from '../support.service';
import TicketsService from './tickets.service';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';

const moduleName = 'ovhManagerSupportTickets';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(component.name, component)
  .config(registerState)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('supportService', SupportService)
  .service('ticketsService', TicketsService);

export default moduleName;
