import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';

import controller from './email-domain-email-filter-edit.controller';
import template from './email-domain-email-filter-edit.html';

const moduleName = 'ovhManagerEmailDomainFilterEdit';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'oui',
    'ngOvhWebUniverseComponents',
  ])
  .controller('EmailsEditFilterCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/email/filter/edit/email-domain-email-filter-edit.html',
        template,
      );
    },
  );

export default moduleName;
