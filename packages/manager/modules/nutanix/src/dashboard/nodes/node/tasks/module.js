import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import { serverTasks } from '@ovh-ux/manager-bm-server-components';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerNutanixNodeTasks';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    serverTasks,
  ])
  .config(routing)
  .component('nutanixNodeTasks', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
