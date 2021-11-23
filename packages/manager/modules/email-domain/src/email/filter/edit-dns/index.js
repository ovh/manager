import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-email-filter-edit-dns.controller';
import template from './email-domain-email-filter-edit-dns.html';

const moduleName = 'ovhManagerEmailDomainFilterEditDns';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('EmailsEditDnsFilterCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/email/filter/edit-dns/email-domain-email-filter-edit-dns.html',
        template,
      );
    },
  );

export default moduleName;
