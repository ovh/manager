import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import controller from './user-ssh-add-cloud.controller';
import template from './user-ssh-add-cloud.html';

const moduleName = 'ovhManagerBillingAutorenewSshAddCloud';

angular
  .module(moduleName, [angularTranslate, ngAtInternet, 'oui', uiRouter])
  .controller('UserAccountSshCloudAdd', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'billing/autoRenew/ssh/add/cloud/user-ssh-add-cloud.html',
        template,
      );
    },
  );

export default moduleName;
