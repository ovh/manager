import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-mailing-list-delete.controller';
import template from './email-domain-mailing-list-delete.html';

const moduleName = 'ovhManagerEmailDomainMailingListDelete';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('MailingListsDeleteCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/mailing-list/delete/email-domain-mailing-list-delete.html',
        template,
      );
    },
  );

export default moduleName;
