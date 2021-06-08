import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import uiRouter from '@uirouter/angularjs';

import controller from './user-ssh-delete.controller';
import template from './user-ssh-delete.html';

const moduleName = 'ovhManagerBillingAutorenewSshDelete';

angular
  .module(moduleName, [angularTranslate, ngOvhUtils, uiRouter])
  .controller('UserAccountSshDelete', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'billing/autoRenew/ssh/delete/user-ssh-delete.html',
        template,
      );
    },
  );

export default moduleName;
