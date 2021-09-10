import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-email-account-update.controller';
import template from './email-domain-email-account-update.html';

const moduleName = 'ovhManagerEmailDomainAccountUpdate';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('EmailsUpdateAccountCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/email/account/update/email-domain-email-account-update.html',
        template,
      );
    },
  );

export default moduleName;
