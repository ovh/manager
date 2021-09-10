import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-mailing-list-moderators-create.controller';
import template from './email-domain-mailing-list-moderators-create.html';

const moduleName = 'ovhManagerEmailDomainMailingListModeratorsCreate';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('MailingListsCreateModeratorCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/mailing-list/moderators/create/email-domain-mailing-list-moderators-create.html',
        template,
      );
    },
  );

export default moduleName;
