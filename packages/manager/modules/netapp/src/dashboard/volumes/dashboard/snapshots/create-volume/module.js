import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@ovh-ux/ng-ui-router-layout';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './component';
import routing from './routing';
import service from './service';

const moduleName = 'ovhManagerNetAppVolumesDashboardSnapshotsCreateVolume';

angular
  .module(moduleName, [
    'ngUiRouterBreadcrumb',
    'ngUiRouterLayout',
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component(
    'ovhManagerNetAppVolumesDashboardSnapshotsCreateVolumeComponent',
    component,
  )
  .service('NetAppSnapshotCreateVolumeService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
