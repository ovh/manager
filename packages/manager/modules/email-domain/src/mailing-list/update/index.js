import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-mailing-list-update.controller';
import template from './email-domain-mailing-list-update.html';

const moduleName = 'ovhManagerEmailDomainMailingListUpdate';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('MailingListsUpdateCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/mailing-list/update/email-domain-mailing-list-update.html',
        template,
      );
    },
  );

export default moduleName;
