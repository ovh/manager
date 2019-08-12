import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-api-wrappers'; // should be a peer dependency of ovh-api-services
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import routing from './remove.routing';

const moduleName = 'ovhManagerPciProjectSshKeysRemove';

angular
  .module(moduleName, [
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
