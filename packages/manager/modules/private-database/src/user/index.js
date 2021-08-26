import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import '@ovh-ux/ng-ovh-utils';

import routing from './user.routing';

import grants from './grants';
import list from './list';

import addController from './add/private-database-user-add.controller';
import addTemplate from './add/private-database-user-add.html';

import deleteController from './delete/private-database-user-delete.controller';
import deleteTemplate from './delete/private-database-user-delete.html';

import updatePasswordController from './update/password/private-database-user-update-password.controller';
import updatePasswordRootTemplate from './update/password/root/private-database-user-update-password-root.html';
import updatePasswordUserTemplate from './update/password/user/private-database-user-update-password-user.html';

const moduleName = 'ovhManagerPrivateDatabaseUser';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    'ngOvhUtils',
    grants,
    list,
  ])
  .config(routing)
  .controller('PrivateDatabaseAddUserCtrl', addController)
  .controller('PrivateDatabaseDeleteUserCtrl', deleteController)
  .controller('PrivateDatabaseUpdatePasswordCtrl', updatePasswordController)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'private-database/user/add/private-database-user-add.html',
        addTemplate,
      );
      $templateCache.put(
        'private-database/user/delete/private-database-user-delete.html',
        deleteTemplate,
      );

      $templateCache.put(
        'private-database/user/update/password/root/private-database-user-update-password-root.html',
        updatePasswordRootTemplate,
      );
      $templateCache.put(
        'private-database/user/update/password/user/private-database-user-update-password-user.html',
        updatePasswordUserTemplate,
      );
    },
  )
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
