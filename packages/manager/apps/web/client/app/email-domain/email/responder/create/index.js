import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-email-responder-create.controller';
import template from './email-domain-email-responder-create.html';

const moduleName = 'ovhManagerEmailDomainResponderCreate';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('EmailsCreateResponderCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/email/responder/create/email-domain-email-responder-create.html',
        template,
      );
    },
  );

export default moduleName;
