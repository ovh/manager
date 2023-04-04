import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './attach-volume.routing';
import component from './attach-volume.component';

const moduleName = 'ovhManagerPciProjectStoragesVolumeBackupListAttachVolume';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component(
    'ovhManagerPciProjectStoragesVolumeBackupListAttachVolume',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
