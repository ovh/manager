import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import blockStorages from '../../../blocks';
import volumeEdit from '../../../blocks/block/edit/volume-edit';
import component from './create-volume.component';
import routing from './create-volume.routing';

const moduleName = 'ovhManagerPciStoragesSnapshotsCreateVolume';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    blockStorages,
    volumeEdit,
  ])
  .config(routing)
  .component('pciProjectStoragesSnapshotsCreateVolume', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
