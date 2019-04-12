import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-api-wrappers'; // should be a peer dependency of ovh-api-services
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import routing from './add.routing';

const moduleName = 'ovhManagerPciProjectSshKeysAdd';

angular
  .module(moduleName, [
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
