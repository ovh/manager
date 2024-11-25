import routing from './contact.routing';
import contactDashboardComponent from './dashboard/dashboard.component';
import editContactDashboardComponent from './edit/edit.component';
import ContactService from './contact.service';
import editAccountFormFieldComponent from './edit/field/edit-account-form-field-component';

const moduleName = 'ovhManagerWebDomainContact';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('domainZoneDashboardContact', contactDashboardComponent)
  .component('domainZoneDashboardContactEdit', editContactDashboardComponent)
  .component('editAccountFormField', editAccountFormFieldComponent)
  .service('ContactService', ContactService)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
