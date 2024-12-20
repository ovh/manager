import routing from './contact.routing';
import contactDashboardComponent from './dashboard/dashboard.component';
import ContactService from './contact.service';

const moduleName = 'ovhManagerWebDomainContact';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('domainZoneDashboardContact', contactDashboardComponent)
  .service('ContactService', ContactService)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
