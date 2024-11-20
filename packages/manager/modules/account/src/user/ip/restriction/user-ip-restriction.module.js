import angular from 'angular';
import 'angular-translate';
import 'ovh-api-services';
import managerCore from '@ovh-ux/manager-core';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import controller from './user-ip-restriction.controller';
import service from './user-ip-restriction.service';
import validationService from './validator.service';

import addController from './add/user-ip-restriction-add.controller';
import deleteController from './delete/user-ip-restriction-delete.controller';

import addTemplate from './add/user-ip-restriction-add.html';
import deleteTemplate from './delete/user-ip-restriction-delete.html';

const moduleName = 'ovhManagerDedicatedAccountUserIpRestriction';

angular
  .module(moduleName, [
    managerCore,
    ngOvhUtils,
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .controller('UserAccount.controllers.ipRestrictions', controller)
  .controller('UserAccount.controllers.ipRestrictions.add', addController)
  .controller('UserAccount.controllers.ipRestrictions.delete', deleteController)
  .service('UserAccount.services.ipRestrictions', service)
  .service('Validator', validationService)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'account/user/ip/restriction/add/user-ip-restriction-add.html',
        addTemplate,
      );
      $templateCache.put(
        'account/user/ip/restriction/delete/user-ip-restriction-delete.html',
        deleteTemplate,
      );
    },
  );

export default moduleName;
