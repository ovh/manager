import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

// deps
import newProjectPayment from './payment';

import routing from './new.routing';
import service from './new.service';
import component from './description/description.component';

const moduleName = 'ovhManagerPciProjectsNew';

angular
  .module(moduleName, [
    newProjectPayment,
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./description/translations */)
  .service('PciProjectNewService', service)
  .component('pciProjectNewDescription', component);

export default moduleName;
