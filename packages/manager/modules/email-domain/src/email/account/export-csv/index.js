import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-ovh-export-csv';

import controller from './email-domain-email-account-export-csv.controller';
import template from './email-domain-email-account-export-csv.html';

const moduleName = 'ovhManagerEmailDomainAccountExportCsv';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhExportCsv',
    'ngOvhWebUniverseComponents',
  ])
  .controller('EmailsAccountsToCsvCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/email/account/export-csv/email-domain-email-account-export-csv.html',
        template,
      );
    },
  );

export default moduleName;
