import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './list.routing';
import component from './list.component';

const moduleName = 'ovhManagerPciProjectStoragesVolumeBackupList';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('ovhManagerPciProjectsProjectStoragesVolumeBackupList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
