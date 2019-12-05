import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import routing from './routing';
import component from './component';
// import service from './service';

import '../index.scss';

const moduleName = 'ovhManagerPciProjectsNewLegacy';

angular
  .module(moduleName, [
    'ui.router',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
