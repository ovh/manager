import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-mailing-list-subscribers-create.controller';
import template from './email-domain-mailing-list-subscribers-create.html';

const moduleName = 'ovhManagerEmailDomainMailingListSubscribersCreate';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('MailingListsCreateSubscriberCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/mailing-list/subscribers/create/email-domain-mailing-list-subscribers-create.html',
        template,
      );
    },
  );

export default moduleName;
