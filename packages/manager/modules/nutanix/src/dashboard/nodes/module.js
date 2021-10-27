import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import { region } from '@ovh-ux/manager-components';

import routing from './routing';
import node from './node';
import component from './component';

import service from './service';

const moduleName = 'ovhManagerNutanixNodes';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    node,
    region,
  ])
  .config(routing)
  .component('nutanixNodes', component)
  .service('NutanixNode', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
