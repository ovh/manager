import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-email-account-change-password.controller';
import template from './email-domain-email-account-change-password.html';

const moduleName = 'ovhManagerEmailDomainAccountChangePassword';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('EmailsChangePasswordAccountCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/email/account/change-password/email-domain-email-account-change-password.html',
        template,
      );
    },
  );

export default moduleName;
