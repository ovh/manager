import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-mailing-list-subscribers-delete.controller';
import template from './email-domain-mailing-list-subscribers-delete.html';

const moduleName = 'ovhManagerEmailDomainMailingListSubscribersDelete';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('MailingListsDeleteSubscribersCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/mailing-list/subscribers/delete/email-domain-mailing-list-subscribers-delete.html',
        template,
      );
    },
  );

export default moduleName;
