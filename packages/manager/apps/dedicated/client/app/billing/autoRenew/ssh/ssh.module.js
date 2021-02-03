import cloud from './add/cloud/user-ssh-add-cloud.html';
import dedicated from './add/dedicated/user-ssh-add-dedicated.html';
import deleteTemplate from './delete/user-ssh-delete.html';

import controller from './user-ssh.controller';
import filter from './sshkeyMin';
import routing from './ssh.routing';

const moduleName = 'ovhManagerBillingSshKeys';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .filter('sshkeyMin', filter)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'billing/autoRenew/ssh/add/cloud/user-ssh-add-cloud.html',
        cloud,
      );
      $templateCache.put(
        'billing/autoRenew/ssh/add/dedicated/user-ssh-add-dedicated.html',
        dedicated,
      );
      $templateCache.put(
        'billing/autoRenew/ssh/delete/user-ssh-delete.html',
        deleteTemplate,
      );
    },
  )
  .controller('UserAccount.controllers.ssh', controller)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
