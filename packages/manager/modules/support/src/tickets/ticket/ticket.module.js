import angular from 'angular';

import ovhUxManagerCore from '@ovh-ux/manager-core';
import ovhUxNgTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouterAngularJs from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';

import message from './message';

import component from './ticket.component';
import { registerState } from './ticket.routing';
import service from './ticket.service';

const moduleName = 'ovhManagerSupportTicket';

angular
  .module(moduleName, [
    angularTranslate,
    message,
    'oui',
    ovhUxNgTranslateAsyncLoader,
    ovhUxManagerCore,
    uiRouterAngularJs,
  ])
  .component(component.name, component)
  .config(registerState)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('ticketService', service);

export default moduleName;
