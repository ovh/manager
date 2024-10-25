import angular from 'angular';
import angularTranslate from 'angular-translate';
import 'ovh-api-services';
import managerCore from '@ovh-ux/manager-core';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import controller from './user-security-backupCode.controller';
import service from './user-security-backupCode.service';
import deleteController from './delete/user-security-backupCode.controller';
import deleteTemplate from './delete/user-security-backupCode.html';
import manageController from './manage/user-security-backupCode-manage.controller';
import manageTemplate from './manage/user-security-backupCode-manage.html';

const moduleName = 'ovhManagerDedicatedAccountUserSecurityBackupCode';

angular
  .module(moduleName, [
    angularTranslate,
    managerCore,
    ngOvhUtils,
    'oui',
    'ovh-api-services',
    uiRouter,
  ])
  .controller('UserAccount.controllers.doubleAuth.backupCode', controller)
  .controller(
    'UserAccount.controllers.doubleAuth.backupCode.delete',
    deleteController,
  )
  .controller(
    'UserAccount.controllers.doubleAuth.backupCode.manage',
    manageController,
  )
  .service('UserAccount.services.doubleAuth.backupCode', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'account/user/security/backupCode/delete/user-security-backupCode.html',
        deleteTemplate,
      );
      $templateCache.put(
        'account/user/security/backupCode/manage/user-security-backupCode-manage.html',
        manageTemplate,
      );
    },
  );

export default moduleName;
