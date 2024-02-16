import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import configModule from './components/config';
import configDriveModule from './components/config-drive';
import optionsModule from './components/options';

import routing from './routing';
import component from './component';
import service from './service';

const moduleName = 'ovhManagerDedicatedServerInstallImage';

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
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('dedicatedServerInstallImage', service)
  .component(component.name, component);

export default moduleName;
