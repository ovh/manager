import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-email-redirection-delete.controller';
import template from './email-domain-email-redirection-delete.html';

const moduleName = 'ovhManagerEmailDomainRedirectionDelete';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('EmailsDeleteRedirectionCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/email/redirection/delete/email-domain-email-redirection-delete.html',
        template,
      );
    },
  );

export default moduleName;
