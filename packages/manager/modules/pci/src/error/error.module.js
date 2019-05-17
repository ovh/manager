import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import routing from './error.routing';
import component from './error.component';

import './error.scss';

const moduleName = 'ovhManagerPciProjectsNewError';

angular
  .module(moduleName, [
    'oui',
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('pciError', component);

export default moduleName;
