import angular from 'angular';
import 'angular-translate';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@uirouter/angularjs';

import controller from './user-ssh-delete.controller';
import template from './user-ssh-delete.html';

const moduleName = 'ovhManagerBillingAutorenewSshDelete';

angular
  .module(moduleName, [ngOvhUtils, 'pascalprecht.translate', 'ui.router'])
  .controller('UserAccount.controllers.ssh.delete', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'billing/autoRenew/ssh/delete/user-ssh-delete.html',
        template,
      );
    },
  );

export default moduleName;
