import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './destinations.component';
import routing from './destinations.routing';

const moduleName = 'ovhManagerPciDataIntegrationDestinations';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
    'ovhManagerPciComponents',
  ])
  .config(routing)
  .component('pciProjectDataIntegrationDestinations', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
