import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './component';
import routing from './routing';

import addModule from './add';
import deleteModule from './delete';

const moduleName = 'ovhManagerNetAppVolumesDashboardSnapshots';

angular
  .module(moduleName, [
    'ngUiRouterBreadcrumb',
    'ngOvhUtils',
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    addModule,
    deleteModule,
  ])
  .config(routing)
  .component('ovhManagerNetAppVolumesDashboardSnapshots', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
