import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-mailing-list-moderators-delete.controller';
import template from './email-domain-mailing-list-moderators-delete.html';

const moduleName = 'ovhManagerEmailDomainMailingListModeratorsDelete';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('MailingListsCreateModeratorsCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/mailing-list/moderators/delete/email-domain-mailing-list-moderators-delete.html',
        template,
      );
    },
  );

export default moduleName;
