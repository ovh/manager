import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'angular-ui-bootstrap';
import '@ovh-ux/ui-kit';
import 'oclazyload';

import set from 'lodash/set';

import advanced from './advanced/advanced.module';
import dashboard from './dashboard/user-dahboard.module';
import supportLevel from './support-level/support-level.module';
import infos from './infos';
import security from './security';
import users from './users/users.module';
import emails from './emails';

import userPasswordTemplate from './password/user-password.html';
import addUserTemplate from './users/add/user-users-add.html';
import deleteUserTemplate from './users/delete/user-users-delete.html';
import disableUserTemplate from './users/disable/user-users-disable.html';
import enableUserTemplate from './users/enable/user-users-enable.html';
import updateUserTemplate from './users/update/user-users-update.html';

import userAccountUsersAddCtrl from './users/add/user-users-add.controller';
import userAccountUsersDeleteCtrl from './users/delete/user-users-delete.controller';
import userAccountUsersDisableCtrl from './users/disable/user-users-disable.controller';
import userAccountUsersEnableCtrl from './users/enable/user-users-enable.controller';
import userAccountUsersUpdateCtrl from './users/update/user-users-update.controller';

import userAccountDoubleAuthPasswordController from './password/user-password.controller';

import routing from './user.routes';

import useraccountUsersService from './users/users.service';
import useraccountGroupsService from './users/group.service';

const moduleName = 'UserAccount';

angular
  .module(moduleName, [
    'oui',
    'ui.bootstrap',
    advanced,
    dashboard,
    infos,
    security,
    supportLevel,
    users,
    emails,
  ])
  .config(routing)
  .controller(
    'UserAccountDoubleAuthPasswordCtrl',
    userAccountDoubleAuthPasswordController,
  )
  .controller('UserAccountUsersAddCtrl', userAccountUsersAddCtrl)
  .controller('UserAccountUsersDisableCtrl', userAccountUsersDisableCtrl)
  .controller('UserAccountUsersDeleteCtrl', userAccountUsersDeleteCtrl)
  .controller('UserAccountUsersEnableCtrl', userAccountUsersEnableCtrl)
  .controller('UserAccountUsersUpdateCtrl', userAccountUsersUpdateCtrl)

  .service('UseraccountUsersService', useraccountUsersService)
  .service('UseraccountGroupsService', useraccountGroupsService)
  .run([
    '$rootScope',
    '$templateCache',
    'ducConstants',
    ($rootScope, $templateCache, ducConstants) => {
      $templateCache.put(
        'account/user/password/user-password.html',
        userPasswordTemplate,
      );
      $templateCache.put(
        'account/user/users/add/user-users-add.html',
        addUserTemplate,
      );
      $templateCache.put(
        'account/user/users/delete/user-users-delete.html',
        deleteUserTemplate,
      );
      $templateCache.put(
        'account/user/users/disable/user-users-disable.html',
        disableUserTemplate,
      );
      $templateCache.put(
        'account/user/users/enable/user-users-enable.html',
        enableUserTemplate,
      );
      $templateCache.put(
        'account/user/users/update/user-users-update.html',
        updateUserTemplate,
      );
      set($rootScope, 'target', ducConstants.target);
      set($rootScope, 'worldPart', ducConstants.target);
    },
  ])
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
