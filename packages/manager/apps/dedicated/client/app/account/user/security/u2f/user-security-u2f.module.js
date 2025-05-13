import angular from 'angular';
import 'angular-translate';
import 'ovh-api-services';
import managerCore from '@ovh-ux/manager-core';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import controller from './user-security-u2f.controller';
import addController from './add/user-security-u2f-add.controller';
import editController from './edit/user-security-u2f-edit.controller';
import deleteController from './delete/user-security-u2f-delete.controller';

import addTemplate from './add/user-security-u2f-add.html';
import editTemplate from './edit/user-security-u2f-edit.html';
import deleteTemplate from './delete/user-security-u2f-delete.html';

import service from './user-security-u2f.service';

const moduleName = 'ovhManagerDedicatedAccountUserSecurityU2f';

angular
  .module(moduleName, [
    managerCore,
    ngOvhUtils,
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .controller('UserAccount.controllers.doubleAuth.u2f', controller)
  .controller('UserAccount.controllers.doubleAuth.u2f.add', addController)
  .controller('UserAccount.controllers.doubleAuth.u2f.edit', editController)
  .controller('UserAccount.controllers.doubleAuth.u2f.delete', deleteController)
  .service('UserAccount.services.doubleAuth.u2f', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'account/user/security/u2f/add/user-security-u2f-add.html',
        addTemplate,
      );
      $templateCache.put(
        'account/user/security/u2f/edit/user-security-u2f-edit.html',
        editTemplate,
      );
      $templateCache.put(
        'account/user/security/u2f/delete/user-security-u2f-delete.html',
        deleteTemplate,
      );
    },
  );

export default moduleName;
