import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import './logs-inputs-add.less';

import component from './add.component';
import configure from './configure/configure.module';
import edit from './edit/edit.module';
import routing from './add.routing';

const moduleName = 'ovhManagerDbaasLogsDetailInputsAdd';

angular
  .module(moduleName, [
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
