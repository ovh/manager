import angular from 'angular';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './command.routing';
import component from './command.component';

const moduleName = 'ovhManagerPciStoragesDatabaseBackupsForkCommandComponent';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(
    'ovhManagerPciStoragesDatabaseBackupsForkCommandComponent',
    component,
  );

export default moduleName;
