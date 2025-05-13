import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-email-delegate.controller';
import template from './email-domain-email-delegate.html';

const moduleName = 'ovhManagerEmailDomainDelegate';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('EmailsDelegateCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/email/delegate/email-domain-email-delegate.html',
        template,
      );
    },
  );

export default moduleName;
