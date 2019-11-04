import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './edit.component';
import routing from './edit.routing';

const moduleName = 'ovhManagerPciInstanceEdit';

angular
  .module(moduleName, [
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',

  ])
  .config(routing)
  .component('pciProjectsProjectInstancesInstanceEdit', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
