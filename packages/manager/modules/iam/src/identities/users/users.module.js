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
import userGroupService from '../user-groups/user-groups.service';
import ssoService from '../sso/sso.service';

import addController from './add/users-add.controller';
import disableController from './disable/users-disable.controller';
import deleteController from './delete/users-delete.controller';
import enableController from './enable/users-enable.controller';
import updateController from './update/users-update.controller';

import addTemplate from './add/users-add.html';
import deleteTemplate from './delete/users-delete.html';
import disableTemplate from './disable/users-disable.html';
import enableTemplate from './enable/users-enable.html';
import updateTemplate from './update/users-update.html';

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
  .service('IamUsersService', service)
  .service('IamUserGroupsService', userGroupService)
  .service('IamSsoService', ssoService)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'iam/identities/users/add/users-add.html',
        addTemplate,
      );
      $templateCache.put(
        'iam/identities/users/disable/users-disable.html',
        disableTemplate,
      );
      $templateCache.put(
        'iam/identities/users/delete/users-delete.html',
        deleteTemplate,
      );
      $templateCache.put(
        'iam/identities/users/enable/users-enable.html',
        enableTemplate,
      );
      $templateCache.put(
        'iam/identities/users/update/users-update.html',
        updateTemplate,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
