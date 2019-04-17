import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import routing from './creating.routing';
// import component from './creating.component';

const moduleName = 'ovhManagerPciProjectsNewCreating';

angular
  .module(moduleName, [
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);
// .component('pciProjectNew', component);

export default moduleName;
