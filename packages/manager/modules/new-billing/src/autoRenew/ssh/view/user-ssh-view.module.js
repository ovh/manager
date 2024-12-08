import angular from 'angular';
import angularTranslate from 'angular-translate';
import uiRouter from '@uirouter/angularjs';

import controller from './user-ssh-view.controller';
import template from './user-ssh-view.html';

const moduleName = 'ovhManagerBillingAutorenewSshView';

angular
  .module(moduleName, [angularTranslate, uiRouter])
  .controller('UserAccountSshView', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'billing/autoRenew/ssh/view/user-ssh-view.html',
        template,
      );
    },
  );

export default moduleName;
