import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './detach-volume.routing';
import component from './detach-volume.component';

const moduleName = 'ovhManagerPciProjectStoragesVolumeBackupCreateDetachVolume';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component(
    'ovhManagerPciProjectsProjectStoragesVolumeBackupCreateDetachVolume',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
