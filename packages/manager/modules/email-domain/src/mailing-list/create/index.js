import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-mailing-list-create.controller';
import template from './email-domain-mailing-list-create.html';

const moduleName = 'ovhManagerEmailDomainMailingListCreate';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('MailingListsCreateCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/mailing-list/create/email-domain-mailing-list-create.html',
        template,
      );
    },
  );

export default moduleName;
