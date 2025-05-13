import routing from './edit.routing';

import editComponent from './edit.component';
import editFormFieldComponent from './field/edit-form-field-component';

const moduleName = 'ovhManagerWebDomainContactEdit';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('domainZoneDashboardContactEdit', editComponent)
  .component('editOwnerFormField', editFormFieldComponent)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
