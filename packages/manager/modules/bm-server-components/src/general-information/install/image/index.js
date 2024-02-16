import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import configModule from './components/config';
import configDriveModule from './components/config-drive';
import optionsModule from './components/options';

import component from './component';

const moduleName = 'ovhManagerBmServerComponentsDashboardInstallImage';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.router',
    ngUiRouterBreadcrumb,
    configModule,
    configDriveModule,
    optionsModule,
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
