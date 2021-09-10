import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-email-acl-delete.controller';
import template from './email-domain-email-acl-delete.html';

const moduleName = 'ovhManagerEmailDomainAclDelete';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('EmailsDeleteAclCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/email/acl/delete/email-domain-email-acl-delete.html',
        template,
      );
    },
  );

export default moduleName;
