import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';
import '@ovh-ux/ng-ovh-payment-method';
import '@ovh-ux/ng-ovh-contacts';

// deps
import newProjectDescription from './description';
import newProjectPayment from './payment';

import routing from './new.routing';
import service from './new.service';
import component from './new.component';

const moduleName = 'ovhManagerPciProjectsNew';

angular
  .module(moduleName, [
    newProjectDescription,
    newProjectPayment,
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhPaymentMethod',
    'ngOvhContacts',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('PciProjectNewService', service)
  .component('pciProjectNew', component);

export default moduleName;
