import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import routing from './user-security-2fa.routing';

const moduleName = 'ovhManagerDedicatedAccountUserSecurity2fa';

angular
  .module(moduleName, ['ovhManagerCore', 'pascalprecht.translate', 'ui.router'])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
