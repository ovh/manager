import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-email-redirection-create.controller';
import template from './email-domain-email-redirection-create.html';

const moduleName = 'ovhManagerEmailDomainRedirectionCreate';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('EmailsCreateRedirectionCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/email/redirection/create/email-domain-email-redirection-create.html',
        template,
      );
    },
  );

export default moduleName;
