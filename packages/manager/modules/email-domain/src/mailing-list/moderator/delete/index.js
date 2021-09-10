import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-mailing-list-moderator-delete.controller';
import template from './email-domain-mailing-list-moderator-delete.html';

const moduleName = 'ovhManagerEmailDomainMailingListModeratorDelete';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('MailingListsDeleteModeratorCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/mailing-list/moderator/delete/email-domain-mailing-list-moderator-delete.html',
        template,
      );
    },
  );

export default moduleName;
