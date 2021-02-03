import angular from 'angular';
import 'angular-translate';
import 'ovh-api-services';
import managerCore from '@ovh-ux/manager-core';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import controller from './user-security-sms.controller';
import addController from './add/user-security-sms-add.controller';
import deleteController from './delete/user-security-sms-delete.controller';
import editController from './edit/user-security-sms-edit.controller';

import addTemplate from './add/user-security-sms-add.html';
import deleteTemplate from './delete/user-security-sms-delete.html';
import editTemplate from './edit/user-security-sms-edit.html';

import service from './user-security-sms.service';

const moduleName = 'ovhManagerDedicatedAccountUserSecuritySms';

angular
  .module(moduleName, [
    managerCore,
    ngOvhUtils,
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .controller('UserAccount.controllers.doubleAuth.sms', controller)
  .controller('UserAccount.controllers.doubleAuth.sms.add', addController)
  .controller('UserAccount.controllers.doubleAuth.sms.delete', deleteController)
  .controller('UserAccount.controllers.doubleAuth.sms.edit', editController)
  .service('UserAccount.services.doubleAuth.sms', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'account/user/security/sms/add/user-security-sms-add.html',
        addTemplate,
      );
      $templateCache.put(
        'account/user/security/sms/delete/user-security-sms-delete.html',
        deleteTemplate,
      );
      $templateCache.put(
        'account/user/security/sms/edit/user-security-sms-edit.html',
        editTemplate,
      );
    },
  );

export default moduleName;
