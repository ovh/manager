import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import controller from './logs-inputs-home-info.controller';

const moduleName = 'ovhManagerDbaasLogsDetailInputsHomeInfo';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .controller('LogsInputsHomeInfoModalCtrl', controller);

export default moduleName;
