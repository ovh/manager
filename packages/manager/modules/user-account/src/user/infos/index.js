import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import '@ovh-ux/ui-kit';
import 'angular-ui-bootstrap';

import routing from './user-infos.routing';
import service from './user-infos.service';
import newAccountFormModule from '../components/newAccountForm';

const moduleName = 'ovhManagerDedicatedAccountUserInfos';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'oui',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    newAccountFormModule,
  ])
  .config(routing)
  .service('UserAccountServiceInfos', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
