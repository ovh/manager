import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import snapshot from './snapshot';
import snapshotDelete from './snapshot/delete';
import onboarding from './onboarding';

import component from './snapshots.component';
import service from './snapshots.service';

import routing from './snapshots.routing';

const moduleName = 'ovhManagerPciStoragesSnapshots';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    snapshot,
    snapshotDelete,
    onboarding,
  ])
  .config(routing)
  .component('pciProjectStoragesSnapshots', component)
  .service('PciProjectStorageSnapshotsService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
