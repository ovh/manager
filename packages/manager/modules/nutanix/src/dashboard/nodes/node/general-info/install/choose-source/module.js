import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import { serverOsInstallFrom } from '@ovh-ux/manager-bm-server-components';

import routing from './routing';
import component from './component';

const moduleName = 'ovhManagerNutanixNodeGeneralInfoServerInstallChooseSource';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'ngUiRouterBreadcrumb',
    'ui.router',
    serverOsInstallFrom,
  ])
  .config(routing)
  .component('nutanixNodeServerInstallChooseSource', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
