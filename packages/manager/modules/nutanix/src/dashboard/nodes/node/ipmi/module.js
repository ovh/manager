import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import { serverIpmi } from '@ovh-ux/manager-bm-server-components';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerNutanixNodeIpmi';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    serverIpmi,
  ])
  .config(routing)
  .component('nutanixNodeIpmi', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
