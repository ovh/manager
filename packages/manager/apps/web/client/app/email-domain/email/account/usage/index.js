import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-email-account-usage.controller';
import template from './email-domain-email-account-usage.html';

const moduleName = 'ovhManagerEmailDomainAccountUpsage';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('EmailsUpdateUsageAccountCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/email/account/usage/email-domain-email-account-usage.html',
        template,
      );
    },
  );

export default moduleName;
