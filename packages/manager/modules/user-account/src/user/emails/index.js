import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import '@ovh-ux/ui-kit';

import routing from './user-emails.routing';
import service from './user-emails.service';

const moduleName = 'ovhManagerDedicatedAccountUserEmails';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'oui',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
  ])
  .config(routing)
  .service('UserAccountEmailsService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
