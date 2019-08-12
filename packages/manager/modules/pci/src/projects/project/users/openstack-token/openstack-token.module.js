import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import component from './openstack-token.component';
import routing from './openstack-token.routing';

const moduleName = 'ovhManagerPciUsersOpenstackToken';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciProjectUsersOpenstackToken', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
