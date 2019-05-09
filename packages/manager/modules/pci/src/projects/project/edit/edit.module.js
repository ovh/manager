import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-api-wrappers'; // should be a peer dependency of ovh-api-services
import '@ovh-ux/ng-ovh-user-pref';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import remove from './remove';

import routing from './edit.routing';

const moduleName = 'ovhManagerPciProjectEdit';

angular
  .module(moduleName, [
    remove,
    'ngOvhUserPref',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
