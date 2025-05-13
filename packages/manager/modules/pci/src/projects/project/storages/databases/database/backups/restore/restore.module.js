import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import restoreComponent from './restore.component';
import routing from './restore.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseBackupsRestore';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component(
    'ovhManagerPciStoragesDatabaseBackupsRestoreComponent',
    restoreComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
