import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import {
  serverGeneralInfo,
  serverTechnicalDetails,
} from '@ovh-ux/manager-bm-server-components';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerNutanixNodeGeneralInfo';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'ngUiRouterBreadcrumb',
    'ui.router',
    ngOvhUtils,
    serverGeneralInfo,
    serverTechnicalDetails,
  ])
  .config(routing)
  .component('nutanixNodeGeneralInfo', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
