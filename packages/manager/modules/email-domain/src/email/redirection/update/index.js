import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-email-redirection-update.controller';
import template from './email-domain-email-redirection-update.html';

const moduleName = 'ovhManagerEmailDomainRedirectionUpdate';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('EmailsUpdateRedirectionCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/email/redirection/update/email-domain-email-redirection-update.html',
        template,
      );
    },
  );

export default moduleName;
