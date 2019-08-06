import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import add from './add';
import component from './contacts.component';
import remove from './remove';
import routing from './contacts.routing';

const moduleName = 'ovhManagerPciProjectBillingContacts';

angular
  .module(moduleName, [
    add,
    remove,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('pciProjectContactsComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
