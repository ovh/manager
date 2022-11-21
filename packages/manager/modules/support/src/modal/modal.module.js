import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';
import './modal.scss';

import component from './modal.component';
import routing from './modal.routing';

const moduleName = 'ovhManagerDedicatedSupportTicketModalBetaHelpcenter';

angular
  .module(moduleName, ['ui.router', 'oui', 'pascalprecht.translate'])
  .component('modalBetaHelpcenter', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
