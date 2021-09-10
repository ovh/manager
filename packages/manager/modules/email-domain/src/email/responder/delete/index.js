import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-email-responder-delete.controller';
import template from './email-domain-email-responder-delete.html';

const moduleName = 'ovhManagerEmailDomainResponderDelete';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('EmailsDeleteResponderCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/email/responder/delete/email-domain-email-responder-delete.html',
        template,
      );
    },
  );

export default moduleName;
