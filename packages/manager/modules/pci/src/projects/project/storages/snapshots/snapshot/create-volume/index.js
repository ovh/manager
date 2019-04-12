import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';
import 'ovh-api-services';

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
  ])
  .config(routing)
  .component('pciProjectStoragesSnapshotsCreateVolume', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
