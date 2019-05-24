import angular from 'angular';

import component from './ticket.component';
import filter from './ticket.linky';
import { registerState } from './ticket.routing';
import SupportService from '../support.service';
import TicketService from './ticket.service';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';
import './ticket.scss';

const moduleName = 'ovhManagerSupportTicket';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(component.name, component)
  .config(registerState)
  .filter('htmlStringLinky', filter)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('supportService', SupportService)
  .service('ticketService', TicketService);

export default moduleName;
