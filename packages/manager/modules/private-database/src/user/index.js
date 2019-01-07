import angular from 'angular';

import userCtrl from './private-database-user.controller';
import userAddCtrl from './add/private-database-user-add.controller';
import userDeleteCtrl from './delete/private-database-user-delete.controller';
import userGrantsCtrl from './grants/private-database-user-grants.controller';
import userListCtrl from './list/private-database-user-list.controller';
import userPasswordUpdateCtrl from './update/password/private-database-user-update-password.controller';

import userTemplate from './private-database-user.html';
import userAddTemplate from './add/private-database-user-add.html';
import userDeleteTemplate from './delete/private-database-user-delete.html';
import userGrantsTemplate from './grants/private-database-user-grants.html';
import userListTemplate from './list/private-database-user-list.html';
import userPasswordUpdateUserTemplate from './update/password/user/private-database-user-update-password-user.html';
import userPasswordUpdateRootTemplate from './update/password/root/private-database-user-update-password-root.html';

const moduleName = 'managerPrivateDatabaseUser';

angular.module(moduleName, [])
  .run(/* @ngInject */($templateCache) => {
    $templateCache.put('private-database/user/private-database-user.html', userTemplate);
    $templateCache.put('private-database/user/add/private-database-user-add.html', userAddTemplate);
    $templateCache.put('private-database/user/delete/private-database-user-delete.html', userDeleteTemplate);
    $templateCache.put('private-database/user/grants/private-database-user-grants.html', userGrantsTemplate);
    $templateCache.put('private-database/user/list/private-database-user-list.html', userListTemplate);
    $templateCache.put('private-database/user/update/password/user/private-database-user-update-password-user.html', userPasswordUpdateUserTemplate);
    $templateCache.put('private-database/user/update/password/root/private-database-user-update-password-root.html', userPasswordUpdateRootTemplate);
  })
  .controller('PrivateDatabaseUsersCtrl', userCtrl)
  .controller('PrivateDatabaseAddUserCtrl', userAddCtrl)
  .controller('PrivateDatabaseDeleteUserCtrl', userDeleteCtrl)
  .controller('PrivateDatabaseUsersGrantsCtrl', userGrantsCtrl)
  .controller('PrivateDatabaseUsersListCtrl', userListCtrl)
  .controller('PrivateDatabaseUpdatePasswordCtrl', userPasswordUpdateCtrl);

export default moduleName;
