import angular from 'angular';
import 'angular-translate';
import 'ovh-api-services';
import managerCore from '@ovh-ux/manager-core';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import controller from './user-security-totp.controller';
import addController from './add/user-security-totp-add.controller';
import editController from './edit/user-security-totp-edit.controller';
import deleteController from './delete/user-security-totp-delete.controller';

import addTemplate from './add/user-security-totp-add.html';
import editTemplate from './edit/user-security-totp-edit.html';
import deleteTemplate from './delete/user-security-totp-delete.html';

import service from './user-security-totp.service';

const moduleName = 'ovhManagerDedicatedAccountUserSecurityTotp';

angular
  .module(moduleName, [
    managerCore,
    ngOvhUtils,
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .controller('UserAccount.controllers.doubleAuth.totp', controller)
  .controller('UserAccount.controllers.doubleAuth.totp.add', addController)
  .controller('UserAccount.controllers.doubleAuth.totp.edit', editController)
  .controller(
    'UserAccount.controllers.doubleAuth.totp.delete',
    deleteController,
  )
  .service('UserAccount.services.doubleAuth.totp', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'account/user/security/totp/add/user-security-totp-add.html',
        addTemplate,
      );
      $templateCache.put(
        'account/user/security/totp/edit/user-security-totp-edit.html',
        editTemplate,
      );
      $templateCache.put(
        'account/user/security/totp/delete/user-security-totp-delete.html',
        deleteTemplate,
      );
    },
  );

export default moduleName;
