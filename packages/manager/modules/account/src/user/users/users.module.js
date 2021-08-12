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

import addTemplate from './add/user-users-add.html';
import deleteTemplate from './delete/user-users-delete.html';
import disableTemplate from './disable/user-users-disable.html';
import enableTemplate from './enable/user-users-enable.html';
import updateTemplate from './update/user-users-update.html';

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
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
