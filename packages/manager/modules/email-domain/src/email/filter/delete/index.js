import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-email-filter-delete.controller';
import template from './email-domain-email-filter-delete.html';

const moduleName = 'ovhManagerEmailDomainFilterDelete';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('EmailsDeleteFilterCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/email/filter/delete/email-domain-email-filter-delete.html',
        template,
      );
    },
  );

export default moduleName;
