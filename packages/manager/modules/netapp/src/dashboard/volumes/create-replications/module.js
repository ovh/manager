import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerNetAppVolumesCreateReplications';

angular
  .module(moduleName, [
    'ngUiRouterBreadcrumb',
    'ngOvhUtils',
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component(moduleName, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
