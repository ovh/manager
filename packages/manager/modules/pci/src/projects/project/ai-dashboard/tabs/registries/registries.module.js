import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './registries.component';
import routing from './registries.routing';
import add from './add';
import deleteComponent from './delete';

const moduleName = 'ovhManagerPciAiDashboardRegistries';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    add,
    deleteComponent,
  ])
  .config(routing)
  .component('pciProjectAiDashboardRegistries', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
