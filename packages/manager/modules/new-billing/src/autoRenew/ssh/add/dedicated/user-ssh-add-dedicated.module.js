import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import controller from './user-ssh-add-dedicated.controller';
import template from './user-ssh-add-dedicated.html';

const moduleName = 'ovhManagerBillingAutorenewSshAddDedicated';

angular
  .module(moduleName, [angularTranslate, ngAtInternet, 'oui', uiRouter])
  .controller('UserAccountSshDedicatedAdd', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'billing/autoRenew/ssh/add/dedicated/user-ssh-add-dedicated.html',
        template,
      );
    },
  );

export default moduleName;
