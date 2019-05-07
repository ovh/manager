import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';
import 'ovh-api-services';

import component from './add.component';
import routing from './add.routing';

const moduleName = 'ovhManagerPciUsersAdd';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciProjectUsersAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
