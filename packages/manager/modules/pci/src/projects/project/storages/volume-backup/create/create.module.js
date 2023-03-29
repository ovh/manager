import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './create.routing';
import component from './create.component';

import detachVolume from './detach-volume';

const moduleName = 'ovhManagerPciProjectStoragesVolumeBackupCreate';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    detachVolume,
  ])
  .config(routing)
  .component(
    'ovhManagerPciProjectsProjectStoragesVolumeBackupCreate',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
