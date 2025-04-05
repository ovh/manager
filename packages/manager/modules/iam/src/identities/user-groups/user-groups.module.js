import angular from 'angular';

import component from './user-groups.component';
import routing from './user-groups.routing';
import service from './user-groups.service';

import groupsAddController from './add/users-groups-add.controller';
import groupsUpdateController from './update/users-groups-update.controller';
import groupsDeleteController from './delete/users-groups-delete.controller';

import groupsAddTemplate from './add/users-groups-add.html';
import groupsUpdateTemplate from './update/users-groups-update.html';
import groupsDeleteTemplate from './delete/users-groups-delete.html';

const moduleName = 'ovhManagerIAMIdentitiesUserGroups';

angular
  .module(moduleName, [])
  .component('iamUserGroups', component)
  .config(routing)
  .controller('IamUsersGroupsAddCtrl', groupsAddController)
  .controller('IamUsersGroupsUpdateCtrl', groupsUpdateController)
  .controller('IamUsersGroupsDeleteCtrl', groupsDeleteController)
  .service('IamUserGroupsService', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'iam/identities/user-groups/add/users-groups-add.html',
        groupsAddTemplate,
      );
      $templateCache.put(
        'iam/identities/user-groups/update/users-groups-update.html',
        groupsUpdateTemplate,
      );
      $templateCache.put(
        'iam/identities/user-groups/delete/users-groups-delete.html',
        groupsDeleteTemplate,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
