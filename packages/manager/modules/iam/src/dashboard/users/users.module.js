import angular from 'angular';
import 'angular-translate';
import 'angular-messages';
import 'bootstrap';
import 'oclazyload';
import 'ovh-api-services';
import managerCore from '@ovh-ux/manager-core';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import ngPaginationFront from '@ovh-ux/ng-pagination-front';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import routing from './users.routing';
import service from './users.service';
import groupService from './group.service';

import addController from './add/users-add.controller';
import disableController from './disable/users-disable.controller';
import deleteController from './delete/users-delete.controller';
import enableController from './enable/users-enable.controller';
import updateController from './update/users-update.controller';
import ssoAddController from './sso/add/sso-add.controller';
import ssoUpdateController from './sso/update/sso-update.controller';
import ssoDeleteController from './sso/delete/sso-delete.controller';
import ssoDetailsController from './sso/details/sso-details.controller';
import groupsAddController from './groups/add/users-groups-add.controller';
import groupsUpdateController from './groups/update/users-groups-update.controller';
import groupsDeleteController from './groups/delete/users-groups-delete.controller';

import addTemplate from './add/users-add.html';
import deleteTemplate from './delete/users-delete.html';
import disableTemplate from './disable/users-disable.html';
import enableTemplate from './enable/users-enable.html';
import updateTemplate from './update/users-update.html';
import ssoAddTemplate from './sso/add/sso-add.html';
import ssoUpdateTemplate from './sso/update/sso-update.html';
import ssoDeleteTemplate from './sso/delete/sso-delete.html';
import ssoDetailsTemplate from './sso/details/sso-details.html';
import groupsAddTemplate from './groups/add/users-groups-add.html';
import groupsUpdateTemplate from './groups/update/users-groups-update.html';
import groupsDeleteTemplate from './groups/delete/users-groups-delete.html';

const moduleName = 'ovhManagerIAMUsers';

angular
  .module(moduleName, [
    managerCore,
    ngOvhUtils,
    ngPaginationFront,
    'ngMessages',
    'oc.lazyLoad',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .controller('IamUsersAddCtrl', addController)
  .controller('IamUsersDisableCtrl', disableController)
  .controller('IamUsersDeleteCtrl', deleteController)
  .controller('IamUsersEnableCtrl', enableController)
  .controller('IamUsersUpdateCtrl', updateController)
  .controller('IamUsersSsoAddCtrl', ssoAddController)
  .controller('IamUsersSsoUpdateCtrl', ssoUpdateController)
  .controller('IamUsersSsoDeleteCtrl', ssoDeleteController)
  .controller('IamUsersSsoDetailsCtrl', ssoDetailsController)
  .controller('IamUsersGroupsAddCtrl', groupsAddController)
  .controller('IamUsersGroupsUpdateCtrl', groupsUpdateController)
  .controller('IamUsersGroupsDeleteCtrl', groupsDeleteController)
  .service('IamUsersService', service)
  .service('IamGroupsService', groupService)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put('iam/dashboard/users/add/users-add.html', addTemplate);
      $templateCache.put(
        'iam/dashboard/users/disable/users-disable.html',
        disableTemplate,
      );
      $templateCache.put(
        'iam/dashboard/users/delete/users-delete.html',
        deleteTemplate,
      );
      $templateCache.put(
        'iam/dashboard/users/enable/users-enable.html',
        enableTemplate,
      );
      $templateCache.put(
        'iam/dashboard/users/update/users-update.html',
        updateTemplate,
      );
      $templateCache.put(
        'iam/dashboard/users/sso/add/sso-add.html',
        ssoAddTemplate,
      );
      $templateCache.put(
        'iam/dashboard/users/sso/update/sso-update.html',
        ssoUpdateTemplate,
      );
      $templateCache.put(
        'iam/dashboard/users/sso/delete/sso-delete.html',
        ssoDeleteTemplate,
      );
      $templateCache.put(
        'iam/dashboard/users/sso/details/sso-details.html',
        ssoDetailsTemplate,
      );
      $templateCache.put(
        'iam/dashboard/users/groups/add/users-groups-add.html',
        groupsAddTemplate,
      );
      $templateCache.put(
        'iam/dashboard/users/groups/update/users-groups-update.html',
        groupsUpdateTemplate,
      );
      $templateCache.put(
        'iam/dashboard/users/groups/delete/users-groups-delete.html',
        groupsDeleteTemplate,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
