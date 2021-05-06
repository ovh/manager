import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import modifyPasswordComponent from './modify-password.component';
import password from '../../../components/password';
import routing from './modify-password.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseUsersModifyPassword';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
    password,
  ])
  .config(routing)
  .component(
    'ovhManagerPciStoragesDatabaseUsersModifyPasswordComponent',
    modifyPasswordComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
