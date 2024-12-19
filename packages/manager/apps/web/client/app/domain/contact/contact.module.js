import routing from './contact.routing';
import contactDashboardComponent from './contact.component';
import ContactService from './contact.service';

import editContactModule from './edit/edit.module';

const moduleName = 'ovhManagerWebDomainContact';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    editContactModule,
  ])
  .component('domainZoneDashboardContact', contactDashboardComponent)
  .service('ContactService', ContactService)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
