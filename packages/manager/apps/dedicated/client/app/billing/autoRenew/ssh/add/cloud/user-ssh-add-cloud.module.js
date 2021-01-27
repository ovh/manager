import angular from 'angular';
import 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import controller from './user-ssh-add-cloud.controller';
import template from './user-ssh-add-cloud.html';

const moduleName = 'ovhManagerBillingAutorenewSshAddCloud';

angular
  .module(moduleName, [
    ngAtInternet,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .controller('UserAccount.controllers.ssh.cloud.add', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'billing/autoRenew/ssh/add/cloud/user-ssh-add-cloud.html',
        template,
      );
    },
  );

export default moduleName;
