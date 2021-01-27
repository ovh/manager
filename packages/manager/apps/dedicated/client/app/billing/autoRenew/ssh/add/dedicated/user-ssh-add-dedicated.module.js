import angular from 'angular';
import 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import controller from './user-ssh-add-dedicated.controller';
import template from './user-ssh-add-dedicated.html';

const moduleName = 'ovhManagerBillingAutorenewSshAddDedicated';

angular
  .module(moduleName, [
    ngAtInternet,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .controller('UserAccount.controllers.ssh.dedicated.add', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'billing/autoRenew/ssh/add/dedicated/user-ssh-add-dedicated.html',
        template,
      );
    },
  );

export default moduleName;
