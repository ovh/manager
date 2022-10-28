import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';
import '@ovh-ux/ng-ui-router-layout';

import component from './edit.component';
import routing from './edit.routing';

const moduleName = 'ovhManagerPciPublicGatewaysEdit';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ovh-api-services',
    'ui.router',
    'ngUiRouterLayout',
  ])
  .config(routing)
  .component('pciProjectPublicGatewaysEdit', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
