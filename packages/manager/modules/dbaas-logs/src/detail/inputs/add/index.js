import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import './logs-inputs-add.less';

import component from './logs-inputs-add.component';
import configure from './configure';
import edit from './edit';
import routing from './logs-inputs-add.routing';

const moduleName = 'ovhManagerDbaasLogsDetailInputsAdd';

angular
  .module(moduleName, [
    'angularMoment',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    configure,
    edit,
  ])
  .config(routing)
  .component('dbaasLogsDetailInputsAdd', component);

export default moduleName;
