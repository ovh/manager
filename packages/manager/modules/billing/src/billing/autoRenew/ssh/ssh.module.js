import cloud from './add/cloud/user-ssh-add-cloud.html';
import dedicated from './add/dedicated/user-ssh-add-dedicated.html';
import deleteTemplate from './delete/user-ssh-delete.html';
import viewTemplate from './view/user-ssh-view.html';

import controller from './user-ssh.controller';
import routing from './ssh.routing';
import service from './user-ssh.service';

import sshViewCtrl from './view/user-ssh-view.controller';
import sshDeleteCtrl from './delete/user-ssh-delete.controller';
import sshCloudAddCtrl from './add/cloud/user-ssh-add-cloud.controller';
import sshDedicatedAddCtrl from './add/dedicated/user-ssh-add-dedicated.controller';

const moduleName = 'ovhManagerBillingSshKeys';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .service('UseraccountSshService', service)
  .controller('UserAccount.controllers.ssh.view', sshViewCtrl)
  .controller('UserAccount.controllers.ssh.delete', sshDeleteCtrl)
  .controller('UserAccount.controllers.ssh.cloud.add', sshCloudAddCtrl)
  .controller('UserAccount.controllers.ssh.dedicated.add', sshDedicatedAddCtrl)
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
      $templateCache.put(
        'billing/autoRenew/ssh/view/user-ssh-view.html',
        viewTemplate,
      );
    },
  )
  .controller('UserAccount.controllers.ssh', controller);

export default moduleName;
