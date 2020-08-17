import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import routing from './routing';
import component from './component';
import service from './service';

import './index.scss';

const moduleName = 'ovhManagerPciProjectsCreating';

angular
  .module(moduleName, [
    'ui.router',
    'ngAtInternet',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component)
  .service('pciProjectCreating', service);

export default moduleName;
