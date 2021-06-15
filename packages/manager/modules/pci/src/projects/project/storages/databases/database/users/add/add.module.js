import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import addUserComponent from './add.component';
import password from '../../../components/password';
import routing from './add.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseUsersAdd';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    password,
  ])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseUsersAdd', addUserComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
