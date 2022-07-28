import angular from 'angular';
import 'angular-translate';
import 'oclazyload';
import 'ovh-api-services';
import managerCore from '@ovh-ux/manager-core';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import routing from './users.routing';
import service from './users.service';
import groupService from './group.service';

import addController from './add/user-users-add.controller';
import disableController from './disable/user-users-disable.controller';
import deleteController from './delete/user-users-delete.controller';
import enableController from './enable/user-users-enable.controller';
import updateController from './update/user-users-update.controller';
import ssoAddController from './sso/add/user-users-sso-add.controller';
import ssoUpdateController from './sso/update/user-users-sso-update.controller';
import ssoDeleteController from './sso/delete/user-users-sso-delete.controller';
import ssoDetailsController from './sso/details/user-users-sso-details.controller';
import groupsAddController from './groups/add/user-users-groups-add.controller';
import groupsUpdateController from './groups/update/user-users-groups-update.controller';
import groupsDeleteController from './groups/delete/user-users-groups-delete.controller';

import addTemplate from './add/user-users-add.html';
import deleteTemplate from './delete/user-users-delete.html';
import disableTemplate from './disable/user-users-disable.html';
import enableTemplate from './enable/user-users-enable.html';
import updateTemplate from './update/user-users-update.html';
import ssoAddTemplate from './sso/add/user-users-sso-add.html';
import ssoUpdateTemplate from './sso/update/user-users-sso-update.html';
import ssoDeleteTemplate from './sso/delete/user-users-sso-delete.html';
import ssoDetailsTemplate from './sso/details/user-users-sso-details.html';
import groupsAddTemplate from './groups/add/user-users-groups-add.html';
import groupsUpdateTemplate from './groups/update/user-users-groups-update.html';
import groupsDeleteTemplate from './groups/delete/user-users-groups-delete.html';

const moduleName = 'ovhManagerDedicatedAccountUserUsers';

angular
  .module(moduleName, [
    managerCore,
    ngOvhUtils,
    'oc.lazyLoad',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .controller('UserAccountUsersAddCtrl', addController)
  .controller('UserAccountUsersDisableCtrl', disableController)
  .controller('UserAccountUsersDeleteCtrl', deleteController)
  .controller('UserAccountUsersEnableCtrl', enableController)
  .controller('UserAccountUsersUpdateCtrl', updateController)
  .controller('UserAccountUsersSSOAddCtrl', ssoAddController)
  .controller('UserAccountUsersSSOUpdateCtrl', ssoUpdateController)
  .controller('UserAccountUsersSSODeleteCtrl', ssoDeleteController)
  .controller('UserAccountUsersSSODetailsCtrl', ssoDetailsController)
  .controller('UserAccountUsersGroupsAddCtrl', groupsAddController)
  .controller('UserAccountUsersGroupsUpdateCtrl', groupsUpdateController)
  .controller('UserAccountUsersGroupsDeleteCtrl', groupsDeleteController)
  .service('UseraccountUsersService', service)
  .service('UseraccountGroupsService', groupService)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'account/user/users/add/user-users-add.html',
        addTemplate,
      );
      $templateCache.put(
        'account/user/users/disable/user-users-disable.html',
        disableTemplate,
      );
      $templateCache.put(
        'account/user/users/delete/user-users-delete.html',
        deleteTemplate,
      );
      $templateCache.put(
        'account/user/users/enable/user-users-enable.html',
        enableTemplate,
      );
      $templateCache.put(
        'account/user/users/update/user-users-update.html',
        updateTemplate,
      );
      $templateCache.put(
        'account/user/users/sso/add/user-users-sso-add.html',
        ssoAddTemplate,
      );
      $templateCache.put(
        'account/user/users/sso/update/user-users-sso-update.html',
        ssoUpdateTemplate,
      );
      $templateCache.put(
        'account/user/users/sso/delete/user-users-sso-delete.html',
        ssoDeleteTemplate,
      );
      $templateCache.put(
        'account/user/users/sso/details/user-users-sso-details.html',
        ssoDetailsTemplate,
      );
      $templateCache.put(
        'account/user/users/groups/add/user-users-groups-add.html',
        groupsAddTemplate,
      );
      $templateCache.put(
        'account/user/users/groups/update/user-users-groups-update.html',
        groupsUpdateTemplate,
      );
      $templateCache.put(
        'account/user/users/groups/delete/user-users-groups-delete.html',
        groupsDeleteTemplate,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
