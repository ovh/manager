import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-email-filter-create.controller';
import template from './email-domain-email-filter-create.html';

const moduleName = 'ovhManagerEmailDomainFilterCreate';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('EmailsCreateFilterCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/email/filter/create/email-domain-email-filter-create.html',
        template,
      );
    },
  );

export default moduleName;
