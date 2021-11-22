import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-email-responder-update.controller';
import template from './email-domain-email-responder-update.html';

const moduleName = 'ovhManagerEmailDomainResponderUpdate';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('EmailsUpdateResponderCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/email/responder/update/email-domain-email-responder-update.html',
        template,
      );
    },
  );

export default moduleName;
