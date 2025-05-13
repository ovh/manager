import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-email-account-unlock.controller';
import template from './email-domain-email-account-unlock.html';

const moduleName = 'ovhManagerEmailDomainAccountUnlock';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('EmailsUnlockAccountCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/email/account/unlock/email-domain-email-account-unlock.html',
        template,
      );
    },
  );

export default moduleName;
