import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import 'angular-translate';

import snapshotPolicies from '../../../../components/snapshot-policies';
import component from './component';
import routing from './routing';

import addModule from './add';
import restoreModule from './restore';
import editModule from './edit';
import deleteModule from './delete';
import service from './service';
import createVolumeModule from './create-volume';

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
    restoreModule,
    editModule,
    deleteModule,
    snapshotPolicies,
    createVolumeModule,
  ])
  .config(routing)
  .component('ovhManagerNetAppVolumesDashboardSnapshots', component)
  .service('NetAppSnapshotService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
