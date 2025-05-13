import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-mailing-list-subscriber-delete.controller';
import template from './email-domain-mailing-list-subscriber-delete.html';

const moduleName = 'ovhManagerEmailDomainMailingListSubscriberDelete';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('MailingListsDeleteSubscriberCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/mailing-list/subscriber/delete/email-domain-mailing-list-subscriber-delete.html',
        template,
      );
    },
  );

export default moduleName;
