import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-mailing-list-send-list-by-email.controller';
import template from './email-domain-mailing-list-send-list-by-email.html';

const moduleName = 'ovhManagerEmailDomainMailingListSendListByEmail';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('MailingListsSendListByEmailCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/mailing-list/send-list-by-email/email-domain-mailing-list-send-list-by-email.html',
        template,
      );
    },
  );

export default moduleName;
