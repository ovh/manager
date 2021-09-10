import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-email-account-delete.controller';
import template from './email-domain-email-account-delete.html';

const moduleName = 'ovhManagerEmailDomainAccountDelete';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('EmailsDeleteAccountCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/email/account/delete/email-domain-email-account-delete.html',
        template,
      );
    },
  );

export default moduleName;
