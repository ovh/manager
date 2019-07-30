import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';
import './ticket.scss';

import TicketMessageModel from '../models/ticket/message';
import TicketModel from '../models/ticket';

import htmlStringLinky from './helpers/ticket.linky';
import component from './ticket.component';
import { registerState } from './ticket.routing';

const moduleName = 'ovhManagerSupportTicket';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    TicketMessageModel,
    TicketModel,
    'ui.router',
  ])
  .component(component.name, component)
  .config(registerState)
  .filter('htmlStringLinky', htmlStringLinky)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
