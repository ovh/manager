import angular from 'angular';
import 'angular-translate';
import ngOvhUserPref from '@ovh-ux/ng-ovh-user-pref';
import '@ovh-ux/ui-kit';

import controller from './email-domain-email-help.controller';
import template from './email-domain-email-help.html';

const moduleName = 'ovhManagerEmailDomainHelp';

angular
  .module(moduleName, [ngOvhUserPref, 'pascalprecht.translate', 'oui'])
  .controller('EmailsHelpCtrl', controller)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'email-domain/email/help/email-domain-email-help.html',
        template,
      );
    },
  );

export default moduleName;
