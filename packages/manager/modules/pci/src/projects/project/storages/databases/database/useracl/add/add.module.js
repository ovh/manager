import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import addUserComponent from './add.component';
import routing from './add.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseUserAclAdd';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseUserAclAdd', addUserComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
